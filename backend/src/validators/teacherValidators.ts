import Joi from "joi";

export const updateTeacherProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  bioUz: Joi.string().max(2000).allow("", null),
  bioRu: Joi.string().max(2000).allow("", null),
  bioEn: Joi.string().max(2000).allow("", null),
  experienceYears: Joi.number().integer().min(0).max(50),
  education: Joi.array().items(
    Joi.object({
      institution: Joi.string().required(),
      degree: Joi.string().required(),
      field: Joi.string().allow(""),
      startYear: Joi.number().integer().min(1950).max(new Date().getFullYear()),
      endYear: Joi.number().integer().min(1950).max(new Date().getFullYear() + 10),
      description: Joi.string().allow(""),
    })
  ),
  certificates: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      issuer: Joi.string().required(),
      issueDate: Joi.date(),
      expiryDate: Joi.date(),
      credentialId: Joi.string().allow(""),
      credentialUrl: Joi.string().uri().allow(""),
    })
  ),
  languagesTaught: Joi.array().items(Joi.string().min(2).max(50)),
  languagesSpoken: Joi.array().items(Joi.string().min(2).max(50)),
  cancellationPolicy: Joi.string().max(1000).allow(""),
  minNoticeHours: Joi.number().integer().min(1).max(168), // Max 1 week
  maxAdvanceDays: Joi.number().integer().min(1).max(365), // Max 1 year
  timezone: Joi.string().valid(
    "Asia/Tashkent",
    "Asia/Almaty",
    "Asia/Bishkek",
    "Asia/Dushanbe",
    "Asia/Ashgabat",
    "Europe/Moscow",
    "Europe/London",
    "America/New_York",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Europe/Berlin",
    "UTC"
  ),
});

export const updateTeacherSettingsSchema = Joi.object({
  isActive: Joi.boolean(),
  timezone: Joi.string().valid(
    "Asia/Tashkent",
    "Asia/Almaty",
    "Asia/Bishkek",
    "Asia/Dushanbe",
    "Asia/Ashgabat",
    "Europe/Moscow",
    "Europe/London",
    "America/New_York",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Europe/Berlin",
    "UTC"
  ),
});

export const updateTeacherChipsSchema = Joi.object({
  teachingLevels: Joi.array().items(
    Joi.string().valid(
      "BEGINNER",
      "ELEMENTARY",
      "INTERMEDIATE",
      "UPPER_INTERMEDIATE",
      "ADVANCED",
      "ALL_LEVELS"
    )
  ),
  examPreparation: Joi.array().items(
    Joi.string().valid(
      "IELTS",
      "TOEFL",
      "SAT",
      "GMAT",
      "GRE",
      "DTM",
      "CEFR",
      "CAMBRIDGE",
      "PEARSON"
    )
  ),
});

export const uploadMediaSchema = Joi.object({
  avatar: Joi.string().uri(),
  videoIntroUrl: Joi.string().uri(),
});
