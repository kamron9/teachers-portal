import express from "express";
import { prisma } from "../lib/prisma";
import { requireRole, requireVerification } from "../middleware/auth";
import {
  validateRequest,
  validateParams,
  validateQuery,
} from "../middleware/validation";
import { AppError, NotFoundError } from "../utils/errors";
import { logger } from "../utils/logger";
import {
  availabilityRuleSchema,
  updateAvailabilitySchema,
  getAvailabilitySchema,
  bulkAvailabilitySchema,
} from "../validators/availabilityValidators";
import { commonSchemas } from "../middleware/validation";
import {
  addDays,
  format,
  isWithinInterval,
  parseISO,
  startOfDay,
  endOfDay,
} from "date-fns";
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
import Joi from "joi";

const router = express.Router();

// Get teacher's availability rules
router.get(
  "/:teacherId",
  validateParams(Joi.object({ teacherId: commonSchemas.id })),
  validateQuery(getAvailabilitySchema),
  async (req, res) => {
    const { teacherId } = req.params;
    const { startDate, endDate, timezone = "Asia/Tashkent" } = req.query;

    // Get teacher's recurring and one-off availability rules
    const rules = await prisma.availabilityRule.findMany({
      where: {
        teacherId,
        OR: [
          { type: "recurring" },
          {
            type: "one_off",
            date: {
              gte: startDate ? parseISO(startDate as string) : undefined,
              lte: endDate ? parseISO(endDate as string) : undefined,
            },
          },
        ],
      },
      orderBy: [
        { type: "asc" },
        { weekday: "asc" },
        { date: "asc" },
        { startTime: "asc" },
      ],
    });

    // Get existing bookings for the date range to show conflicts
    const bookings = await prisma.booking.findMany({
      where: {
        teacherId,
        status: { in: ["PENDING", "CONFIRMED"] },
        startAt: {
          gte: startDate ? parseISO(startDate as string) : undefined,
          lte: endDate ? parseISO(endDate as string) : undefined,
        },
      },
      select: {
        startAt: true,
        endAt: true,
        status: true,
      },
    });

    res.json({
      rules,
      bookings,
      timezone,
    });
  },
);

// Create availability rule (Teacher only)
router.post(
  "/",
  requireRole("TEACHER"),
  requireVerification("teacher"),
  validateRequest(availabilityRuleSchema),
  async (req, res) => {
    const teacherId = req.user!.id;
    const { type, weekday, date, startTime, endTime, isOpen } = req.body;

    // Validate time format and logic
    if (startTime >= endTime) {
      throw new AppError(
        "Start time must be before end time",
        400,
        "INVALID_TIME_SLOT",
      );
    }

    // For one-off rules, check if date is in the future
    if (type === "one_off" && date) {
      const ruleDate = parseISO(date);
      if (ruleDate < startOfDay(new Date())) {
        throw new AppError(
          "Cannot create availability for past dates",
          400,
          "PAST_DATE_BOOKING",
        );
      }
    }

    // Check for overlapping rules
    const overlappingRule = await findOverlappingRule(teacherId, {
      type,
      weekday,
      date: date ? parseISO(date) : undefined,
      startTime,
      endTime,
    });

    if (overlappingRule) {
      throw new AppError(
        "Overlapping availability rule exists",
        409,
        "SCHEDULE_CONFLICT",
      );
    }

    const rule = await prisma.availabilityRule.create({
      data: {
        teacherId,
        type,
        weekday: type === "recurring" ? weekday : null,
        date: type === "one_off" && date ? parseISO(date) : null,
        startTime,
        endTime,
        isOpen,
      },
    });

    logger.info("Availability rule created", {
      teacherId,
      ruleId: rule.id,
      type,
      isOpen,
    });

    res.status(201).json(rule);
  },
);

// Update availability rule (Teacher only)
router.put(
  "/:ruleId",
  requireRole("TEACHER"),
  requireVerification("teacher"),
  validateParams(Joi.object({ ruleId: commonSchemas.id })),
  validateRequest(updateAvailabilitySchema),
  async (req, res) => {
    const { ruleId } = req.params;
    const teacherId = req.user!.id;

    const existingRule = await prisma.availabilityRule.findFirst({
      where: {
        id: ruleId,
        teacherId,
      },
    });

    if (!existingRule) {
      throw new NotFoundError("Availability rule not found");
    }

    const updateData = { ...req.body };

    // Validate time logic if times are being updated
    if (updateData.startTime && updateData.endTime) {
      if (updateData.startTime >= updateData.endTime) {
        throw new AppError(
          "Start time must be before end time",
          400,
          "INVALID_TIME_SLOT",
        );
      }
    }

    // Parse date if provided
    if (updateData.date) {
      updateData.date = parseISO(updateData.date);
    }

    const updatedRule = await prisma.availabilityRule.update({
      where: { id: ruleId },
      data: updateData,
    });

    logger.info("Availability rule updated", {
      teacherId,
      ruleId,
      updates: Object.keys(updateData),
    });

    res.json(updatedRule);
  },
);

// Delete availability rule (Teacher only)
router.delete(
  "/:ruleId",
  requireRole("TEACHER"),
  requireVerification("teacher"),
  validateParams(Joi.object({ ruleId: commonSchemas.id })),
  async (req, res) => {
    const { ruleId } = req.params;
    const teacherId = req.user!.id;

    const rule = await prisma.availabilityRule.findFirst({
      where: {
        id: ruleId,
        teacherId,
      },
    });

    if (!rule) {
      throw new NotFoundError("Availability rule not found");
    }

    await prisma.availabilityRule.delete({
      where: { id: ruleId },
    });

    logger.info("Availability rule deleted", {
      teacherId,
      ruleId,
    });

    res.json({ message: "Availability rule deleted successfully" });
  },
);

// Bulk create/update availability (Teacher only)
router.post(
  "/bulk",
  requireRole("TEACHER"),
  requireVerification("teacher"),
  validateRequest(bulkAvailabilitySchema),
  async (req, res) => {
    const teacherId = req.user!.id;
    const { rules, replaceExisting = false } = req.body;

    await prisma.$transaction(async (tx) => {
      // If replacing existing, delete current rules
      if (replaceExisting) {
        await tx.availabilityRule.deleteMany({
          where: { teacherId },
        });
      }

      // Create new rules
      const rulesData = rules.map((rule: any) => ({
        teacherId,
        type: rule.type,
        weekday: rule.type === "recurring" ? rule.weekday : null,
        date: rule.type === "one_off" && rule.date ? parseISO(rule.date) : null,
        startTime: rule.startTime,
        endTime: rule.endTime,
        isOpen: rule.isOpen,
      }));

      await tx.availabilityRule.createMany({
        data: rulesData,
        skipDuplicates: !replaceExisting,
      });
    });

    logger.info("Bulk availability update", {
      teacherId,
      rulesCount: rules.length,
      replaceExisting,
    });

    res.json({
      message: "Availability updated successfully",
      rulesCreated: rules.length,
    });
  },
);

// Get available time slots for booking
router.get(
  "/:teacherId/slots",
  validateParams(Joi.object({ teacherId: commonSchemas.id })),
  validateQuery(
    Joi.object({
      startDate: Joi.date().iso().required(),
      endDate: Joi.date().iso().min(Joi.ref("startDate")).required(),
      timezone: Joi.string().default("Asia/Tashkent"),
      duration: Joi.number().valid(30, 60, 90, 120).default(60),
      subjectOfferingId: Joi.string().uuid().optional(),
    }),
  ),
  async (req, res) => {
    const { teacherId } = req.params;
    const {
      startDate,
      endDate,
      timezone = "Asia/Tashkent",
      duration = 60,
      subjectOfferingId,
    } = req.query;

    // Verify teacher exists and is verified
    const teacher = await prisma.teacherProfile.findUnique({
      where: {
        id: teacherId,
        verificationStatus: "APPROVED",
      },
      select: {
        id: true,
        minNoticeHours: true,
        maxAdvanceDays: true,
        timezone: true,
      },
    });

    if (!teacher) {
      throw new NotFoundError("Teacher not found or not verified");
    }

    // Generate available slots
    const slots = await generateAvailableSlots({
      teacherId,
      startDate: parseISO(startDate as string),
      endDate: parseISO(endDate as string),
      timezone: timezone as string,
      duration: duration as number,
      minNoticeHours: teacher.minNoticeHours,
      maxAdvanceDays: teacher.maxAdvanceDays,
      teacherTimezone: teacher.timezone,
    });

    res.json({
      slots,
      timezone,
      duration,
      teacher: {
        id: teacher.id,
        minNoticeHours: teacher.minNoticeHours,
        maxAdvanceDays: teacher.maxAdvanceDays,
        timezone: teacher.timezone,
      },
    });
  },
);

// Get teacher's schedule overview
router.get(
  "/:teacherId/schedule",
  validateParams(Joi.object({ teacherId: commonSchemas.id })),
  validateQuery(
    Joi.object({
      startDate: Joi.date().iso().required(),
      endDate: Joi.date().iso().min(Joi.ref("startDate")).required(),
      timezone: Joi.string().default("Asia/Tashkent"),
    }),
  ),
  async (req, res) => {
    const { teacherId } = req.params;
    const { startDate, endDate, timezone = "Asia/Tashkent" } = req.query;

    const [availabilityRules, bookings] = await Promise.all([
      // Get availability rules
      prisma.availabilityRule.findMany({
        where: {
          teacherId,
          OR: [
            { type: "recurring" },
            {
              type: "one_off",
              date: {
                gte: parseISO(startDate as string),
                lte: parseISO(endDate as string),
              },
            },
          ],
        },
      }),

      // Get bookings
      prisma.booking.findMany({
        where: {
          teacherId,
          status: { in: ["PENDING", "CONFIRMED"] },
          startAt: {
            gte: parseISO(startDate as string),
            lte: parseISO(endDate as string),
          },
        },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          subjectOffering: {
            select: {
              subjectName: true,
            },
          },
        },
      }),
    ]);

    // Generate daily schedule
    const schedule = generateDailySchedule({
      startDate: parseISO(startDate as string),
      endDate: parseISO(endDate as string),
      availabilityRules,
      bookings,
      timezone: timezone as string,
    });

    res.json({
      schedule,
      availabilityRules,
      bookings: bookings.length,
      timezone,
    });
  },
);

// Helper functions
async function findOverlappingRule(
  teacherId: string,
  rule: {
    type: string;
    weekday?: number;
    date?: Date;
    startTime: string;
    endTime: string;
  },
): Promise<any> {
  const whereClause: any = {
    teacherId,
    type: rule.type,
    NOT: {
      OR: [
        { endTime: { lte: rule.startTime } },
        { startTime: { gte: rule.endTime } },
      ],
    },
  };

  if (rule.type === "recurring") {
    whereClause.weekday = rule.weekday;
  } else if (rule.type === "one_off") {
    whereClause.date = rule.date;
  }

  return await prisma.availabilityRule.findFirst({
    where: whereClause,
  });
}

async function generateAvailableSlots({
  teacherId,
  startDate,
  endDate,
  timezone,
  duration,
  minNoticeHours,
  maxAdvanceDays,
  teacherTimezone,
}: {
  teacherId: string;
  startDate: Date;
  endDate: Date;
  timezone: string;
  duration: number;
  minNoticeHours: number;
  maxAdvanceDays: number;
  teacherTimezone: string;
}): Promise<any[]> {
  // Get availability rules
  const rules = await prisma.availabilityRule.findMany({
    where: {
      teacherId,
      isOpen: true,
    },
  });

  // Get existing bookings
  const bookings = await prisma.booking.findMany({
    where: {
      teacherId,
      status: { in: ["PENDING", "CONFIRMED"] },
      startAt: { gte: startDate },
      endAt: { lte: endDate },
    },
    select: {
      startAt: true,
      endAt: true,
    },
  });

  const slots: any[] = [];
  const now = new Date();
  const maxDate = addDays(now, maxAdvanceDays);

  // Generate slots for each day
  let currentDate = startDate;
  while (currentDate <= endDate && currentDate <= maxDate) {
    const daySlots = generateDaySlots({
      date: currentDate,
      rules,
      bookings,
      duration,
      minNoticeHours,
      now,
      timezone,
      teacherTimezone,
    });

    slots.push(...daySlots);
    currentDate = addDays(currentDate, 1);
  }

  return slots;
}

function generateDaySlots({
  date,
  rules,
  bookings,
  duration,
  minNoticeHours,
  now,
  timezone,
  teacherTimezone,
}: any): any[] {
  const daySlots: any[] = [];
  const weekday = date.getDay();

  // Find applicable rules for this day
  const applicableRules = rules.filter((rule: any) => {
    if (rule.type === "recurring") {
      return rule.weekday === weekday;
    } else if (rule.type === "one_off") {
      return (
        rule.date &&
        format(rule.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      );
    }
    return false;
  });

  for (const rule of applicableRules) {
    if (!rule.isOpen) continue;

    // Generate time slots within this rule
    const ruleSlots = generateTimeSlots({
      date,
      startTime: rule.startTime,
      endTime: rule.endTime,
      duration,
      minNoticeHours,
      now,
      timezone,
      teacherTimezone,
    });

    // Filter out booked slots
    const availableSlots = ruleSlots.filter((slot) => {
      return !bookings.some((booking: any) => {
        return (
          isWithinInterval(slot.startAt, {
            start: booking.startAt,
            end: booking.endAt,
          }) ||
          isWithinInterval(slot.endAt, {
            start: booking.startAt,
            end: booking.endAt,
          })
        );
      });
    });

    daySlots.push(...availableSlots);
  }

  return daySlots;
}

function generateTimeSlots({
  date,
  startTime,
  endTime,
  duration,
  minNoticeHours,
  now,
  timezone,
  teacherTimezone,
}: any): any[] {
  const slots: any[] = [];

  // Parse times
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  let currentTime = new Date(date);
  currentTime.setHours(startHour, startMinute, 0, 0);

  const endTime_date = new Date(date);
  endTime_date.setHours(endHour, endMinute, 0, 0);

  while (
    currentTime.getTime() + duration * 60 * 1000 <=
    endTime_date.getTime()
  ) {
    const slotStart = new Date(currentTime);
    const slotEnd = new Date(currentTime.getTime() + duration * 60 * 1000);

    // Check minimum notice requirement
    const hoursUntilSlot =
      (slotStart.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilSlot >= minNoticeHours) {
      slots.push({
        startAt: slotStart,
        endAt: slotEnd,
        duration,
        available: true,
      });
    }

    // Move to next slot (30-minute intervals)
    currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
  }

  return slots;
}

function generateDailySchedule({
  startDate,
  endDate,
  availabilityRules,
  bookings,
  timezone,
}: any): any[] {
  const schedule: any[] = [];

  let currentDate = startDate;
  while (currentDate <= endDate) {
    const daySchedule = {
      date: format(currentDate, "yyyy-MM-dd"),
      weekday: currentDate.getDay(),
      availabilityRules: availabilityRules.filter((rule: any) => {
        if (rule.type === "recurring") {
          return rule.weekday === currentDate.getDay();
        } else if (rule.type === "one_off") {
          return (
            rule.date &&
            format(rule.date, "yyyy-MM-dd") ===
              format(currentDate, "yyyy-MM-dd")
          );
        }
        return false;
      }),
      bookings: bookings.filter((booking: any) => {
        return (
          format(booking.startAt, "yyyy-MM-dd") ===
          format(currentDate, "yyyy-MM-dd")
        );
      }),
    };

    schedule.push(daySchedule);
    currentDate = addDays(currentDate, 1);
  }

  return schedule;
}

export default router;
