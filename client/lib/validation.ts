import { z } from "zod";

// Email validation
export const emailSchema = z
  .string()
  .email("To'g'ri email manzilini kiriting")
  .min(1, "Email majburiy");

// Phone validation for Uzbekistan
export const phoneSchema = z
  .string()
  .regex(/^\+998\d{9}$/, "To'g'ri telefon raqamini kiriting (+998XXXXXXXXX)")
  .min(1, "Telefon raqami majburiy");

// Password validation
export const passwordSchema = z
  .string()
  .min(8, "Parol kamida 8 ta belgidan iborat bo'lishi kerak")
  .regex(/[A-Z]/, "Parolda kamida bitta katta harf bo'lishi kerak")
  .regex(/[a-z]/, "Parolda kamida bitta kichik harf bo'lishi kerak")
  .regex(/[0-9]/, "Parolda kamida bitta raqam bo'lishi kerak");

// Name validation
export const nameSchema = z
  .string()
  .min(2, "Ism kamida 2 ta harfdan iborat bo'lishi kerak")
  .max(50, "Ism 50 ta harfdan oshmasligi kerak")
  .regex(
    /^[a-zA-Zа-яёА-ЯЁ\s]+$/,
    "Ismda faqat harflar va bo'sh joy bo'lishi mumkin",
  );

// Price validation (UZS)
export const priceSchema = z
  .number()
  .min(10000, "Minimal narx 10,000 UZS")
  .max(1000000, "Maksimal narx 1,000,000 UZS");

// Bio validation
export const bioSchema = z
  .string()
  .min(50, "Bio kamida 50 ta belgidan iborat bo'lishi kerak")
  .max(1000, "Bio 1000 ta belgidan oshmasligi kerak");

// OTP validation
export const otpSchema = z
  .string()
  .length(6, "Tasdiqlash kodi 6 xonali bo'lishi kerak")
  .regex(/^\d{6}$/, "Tasdiqlash kodida faqat raqamlar bo'lishi kerak");

// Login form validation
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Parol majburiy"),
});

// Register form validation
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema.optional(),
  role: z.enum(["STUDENT", "TEACHER"], {
    required_error: "Rol tanlash majburiy",
  }),
});

// Teacher profile validation
export const teacherProfileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  bio: bioSchema,
  experienceYears: z.number().min(0).max(50),
  languages: z.array(z.string()).min(1, "Kamida bitta til tanlang"),
  subjects: z.array(z.string()).min(1, "Kamida bitta fan tanlang"),
  hourlyRate: priceSchema,
});

// Student profile validation
export const studentProfileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema.optional(),
  preferredLanguages: z.array(z.string()).min(1, "Kamida bitta til tanlang"),
});

// Review validation
export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Kamida 1 yulduz bering")
    .max(5, "Maksimal 5 yulduz"),
  comment: z
    .string()
    .max(500, "Sharh 500 ta belgidan oshmasligi kerak")
    .optional(),
});

// Message validation
export const messageSchema = z.object({
  content: z
    .string()
    .min(1, "Xabar mazmuni bo'sh bo'lishi mumkin emas")
    .max(1000, "Xabar 1000 ta belgidan oshmasligi kerak"),
});

// Utility functions
export function validateField<T>(
  schema: z.ZodSchema<T>,
  value: unknown,
): {
  success: boolean;
  error?: string;
  data?: T;
} {
  try {
    const data = schema.parse(value);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Validatsiya xatosi" };
  }
}

export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): {
  success: boolean;
  errors?: Record<string, string>;
  data?: T;
} {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: "Validatsiya xatosi" } };
  }
}
