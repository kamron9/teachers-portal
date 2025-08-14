import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import { authenticate, generateToken, generateEmailToken, verifyEmailToken } from '../middleware/auth.js';
import { validateRequest, registerSchema, loginSchema, changePasswordSchema, forgotPasswordSchema, resetPasswordSchema } from '../middleware/validation.js';
import { sendEmail } from '../utils/email.js';

const router = express.Router();

// Register
router.post('/register', validateRequest(registerSchema), async (req, res) => {
  try {
    const { email, password, firstName, lastName, role = 'student', phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create user
    const user = new User({
      email,
      password,
      role,
      profile: {
        firstName,
        lastName,
        phone,
      },
      verificationToken: generateEmailToken(crypto.randomUUID()),
    });

    await user.save();

    // Create role-specific profile
    if (role === 'student') {
      const student = new Student({ userId: user._id });
      await student.save();
    } else if (role === 'teacher') {
      const teacher = new Teacher({ userId: user._id });
      await teacher.save();
    }

    // Send verification email
    try {
      await sendEmail({
        to: email,
        subject: 'Verify your email - TutorUZ',
        template: 'email-verification',
        data: {
          name: firstName,
          verificationLink: `${process.env.FRONTEND_URL}/verify-email?token=${user.verificationToken}`,
        },
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', validateRequest(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last active
    user.lastActiveAt = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify email
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Resend verification email
router.post('/resend-verification', authenticate, async (req, res) => {
  try {
    const user = req.user!;

    if (user.isVerified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    const verificationToken = generateEmailToken(user._id);
    user.verificationToken = verificationToken;
    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'Verify your email - TutorUZ',
      template: 'email-verification',
      data: {
        name: user.profile.firstName,
        verificationLink: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`,
      },
    });

    res.json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Forgot password
router.post('/forgot-password', validateRequest(forgotPasswordSchema), async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await user.save();

    // Send reset email
    await sendEmail({
      to: email,
      subject: 'Password Reset - TutorUZ',
      template: 'password-reset',
      data: {
        name: user.profile.firstName,
        resetLink: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
        expiresIn: '24 hours',
      },
    });

    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset password
router.post('/reset-password', validateRequest(resetPasswordSchema), async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change password
router.post('/change-password', authenticate, validateRequest(changePasswordSchema), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = req.user!;
    
    // Get role-specific profile
    let profile = null;
    if (user.role === 'student') {
      profile = await Student.findOne({ userId: user._id });
    } else if (user.role === 'teacher') {
      profile = await Teacher.findOne({ userId: user._id });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        preferences: user.preferences,
        isVerified: user.isVerified,
        lastActiveAt: user.lastActiveAt,
        createdAt: user.createdAt,
      },
      roleProfile: profile,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout (invalidate token on client side)
router.post('/logout', authenticate, async (req, res) => {
  try {
    // Update last active time
    const user = await User.findById(req.userId);
    if (user) {
      user.lastActiveAt = new Date();
      await user.save();
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
