import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.js';

export interface AuthRequest extends Request {
  user?: IUser;
  userId?: string;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, jwtSecret) as { userId: string };
    
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    req.user = user;
    req.userId = user._id.toString();
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Access denied. User not authenticated.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
      const decoded = jwt.verify(token, jwtSecret) as { userId: string };
      
      const user = await User.findById(decoded.userId).select('-password');
      if (user) {
        req.user = user;
        req.userId = user._id.toString();
      }
    }
    
    next();
  } catch (error) {
    // Invalid token, but continue without user
    next();
  }
};

export const generateToken = (userId: string): string => {
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  return jwt.sign({ userId }, jwtSecret, { expiresIn });
};

export const verifyEmailToken = (token: string): { userId: string } | null => {
  try {
    const jwtSecret = process.env.JWT_EMAIL_SECRET || 'your-email-secret-key';
    return jwt.verify(token, jwtSecret) as { userId: string };
  } catch (error) {
    return null;
  }
};

export const generateEmailToken = (userId: string): string => {
  const jwtSecret = process.env.JWT_EMAIL_SECRET || 'your-email-secret-key';
  return jwt.sign({ userId }, jwtSecret, { expiresIn: '24h' });
};
