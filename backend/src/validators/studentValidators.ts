import Joi from "joi";

export const updateStudentProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  avatar: Joi.string().uri().allow("", null),
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
  preferredLanguages: Joi.array().items(
    Joi.string().valid("uz", "ru", "en", "ar", "tr", "ko", "zh", "fr", "de", "es")
  ),
});
