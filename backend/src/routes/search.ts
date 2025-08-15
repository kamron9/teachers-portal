import express from "express";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole } from "../middleware/auth";
import { validateQuery } from "../middleware/validation";
import { AppError } from "../utils/errors";
import { logger } from "../utils/logger";
import {
  teacherSearchSchema,
  studentSearchSchema,
  subjectSearchSchema,
  universalSearchSchema,
  advancedFilterSchema,
} from "../validators/searchValidators";

const router = express.Router();

// Universal search endpoint
router.get(
  "/",
  requireAuth,
  validateQuery(universalSearchSchema),
  async (req, res) => {
    const {
      query,
      type = "all",
      page = 1,
      limit = 20,
      sortBy = "relevance",
      sortOrder = "desc",
    } = req.query;

    const skip = (page - 1) * limit;
    const results: any = {
      teachers: [],
      students: [],
      subjects: [],
      totalResults: 0,
    };

    try {
      // Search teachers
      if (type === "all" || type === "teachers") {
        const teacherWhere = {
          AND: [
            {
              user: {
                isActive: true,
                role: "TEACHER",
              },
            },
            {
              OR: [
                {
                  firstName: {
                    contains: query as string,
                    mode: "insensitive" as const,
                  },
                },
                {
                  lastName: {
                    contains: query as string,
                    mode: "insensitive" as const,
                  },
                },
                {
                  bio: {
                    contains: query as string,
                    mode: "insensitive" as const,
                  },
                },
                {
                  specializations: {
                    has: query as string,
                  },
                },
                {
                  subjectOfferings: {
                    some: {
                      subjectName: {
                        contains: query as string,
                        mode: "insensitive" as const,
                      },
                    },
                  },
                },
              ],
            },
          ],
        };

        let teacherOrderBy: any = { createdAt: "desc" };
        if (sortBy === "rating") {
          teacherOrderBy = { rating: sortOrder };
        } else if (sortBy === "experience") {
          teacherOrderBy = { experienceYears: sortOrder };
        } else if (sortBy === "price") {
          teacherOrderBy = { hourlyRate: sortOrder };
        }

        const [teachers, teacherCount] = await Promise.all([
          prisma.teacherProfile.findMany({
            where: teacherWhere,
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  isActive: true,
                },
              },
              subjectOfferings: {
                select: {
                  id: true,
                  subjectName: true,
                  level: true,
                  pricePerHour: true,
                },
                take: 3,
              },
              _count: {
                select: {
                  reviews: {
                    where: { status: "APPROVED" },
                  },
                },
              },
            },
            orderBy: teacherOrderBy,
            skip: type === "teachers" ? skip : 0,
            take: type === "teachers" ? limit : 10,
          }),
          prisma.teacherProfile.count({ where: teacherWhere }),
        ]);

        results.teachers = teachers;
        if (type === "teachers") {
          results.totalResults = teacherCount;
        }
      }

      // Search students (admin only)
      if (
        (type === "all" || type === "students") &&
        req.user!.role === "ADMIN"
      ) {
        const studentWhere = {
          AND: [
            {
              user: {
                isActive: true,
                role: "STUDENT",
              },
            },
            {
              OR: [
                {
                  firstName: {
                    contains: query as string,
                    mode: "insensitive" as const,
                  },
                },
                {
                  lastName: {
                    contains: query as string,
                    mode: "insensitive" as const,
                  },
                },
                {
                  preferredSubjects: {
                    has: query as string,
                  },
                },
              ],
            },
          ],
        };

        const [students, studentCount] = await Promise.all([
          prisma.studentProfile.findMany({
            where: studentWhere,
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  isActive: true,
                  createdAt: true,
                },
              },
              _count: {
                select: {
                  bookings: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
            skip: type === "students" ? skip : 0,
            take: type === "students" ? limit : 10,
          }),
          prisma.studentProfile.count({ where: studentWhere }),
        ]);

        results.students = students;
        if (type === "students") {
          results.totalResults = studentCount;
        }
      }

      // Search subjects
      if (type === "all" || type === "subjects") {
        const subjectWhere = {
          OR: [
            {
              name: {
                contains: query as string,
                mode: "insensitive" as const,
              },
            },
            {
              description: {
                contains: query as string,
                mode: "insensitive" as const,
              },
            },
            {
              category: {
                contains: query as string,
                mode: "insensitive" as const,
              },
            },
          ],
        };

        const [subjects, subjectCount] = await Promise.all([
          prisma.subject.findMany({
            where: subjectWhere,
            include: {
              _count: {
                select: {
                  subjectOfferings: true,
                },
              },
            },
            orderBy: { name: "asc" },
            skip: type === "subjects" ? skip : 0,
            take: type === "subjects" ? limit : 10,
          }),
          prisma.subject.count({ where: subjectWhere }),
        ]);

        results.subjects = subjects;
        if (type === "subjects") {
          results.totalResults = subjectCount;
        }
      }

      // Calculate total for 'all' type
      if (type === "all") {
        results.totalResults =
          results.teachers.length +
          results.students.length +
          results.subjects.length;
      }

      logger.info("Universal search performed", {
        query,
        type,
        userId: req.user!.id,
        resultsCount: results.totalResults,
      });

      res.json({
        query,
        type,
        results,
        pagination: {
          page,
          limit,
          total: results.totalResults,
          pages: Math.ceil(results.totalResults / limit),
        },
      });
    } catch (error) {
      logger.error("Search error", { error, query, type });
      throw new AppError("Search failed", 500, "SEARCH_ERROR");
    }
  },
);

// Advanced teacher search with filters
router.get(
  "/teachers",
  requireAuth,
  validateQuery(teacherSearchSchema),
  async (req, res) => {
    const {
      query,
      subjects,
      minRating,
      maxRating,
      minPrice,
      maxPrice,
      experienceLevel,
      availability,
      location,
      languages,
      sortBy = "rating",
      sortOrder = "desc",
      page = 1,
      limit = 20,
    } = req.query;

    const skip = (page - 1) * limit;
    let whereClause: any = {
      user: {
        isActive: true,
        role: "TEACHER",
      },
    };

    // Text search
    if (query) {
      whereClause.OR = [
        {
          firstName: {
            contains: query as string,
            mode: "insensitive",
          },
        },
        {
          lastName: {
            contains: query as string,
            mode: "insensitive",
          },
        },
        {
          bio: {
            contains: query as string,
            mode: "insensitive",
          },
        },
        {
          specializations: {
            has: query as string,
          },
        },
      ];
    }

    // Subject filter
    if (subjects && Array.isArray(subjects) && subjects.length > 0) {
      whereClause.subjectOfferings = {
        some: {
          subjectName: {
            in: subjects as string[],
          },
        },
      };
    }

    // Rating filter
    if (minRating || maxRating) {
      whereClause.rating = {};
      if (minRating) whereClause.rating.gte = Number(minRating);
      if (maxRating) whereClause.rating.lte = Number(maxRating);
    }

    // Price filter
    if (minPrice || maxPrice) {
      whereClause.hourlyRate = {};
      if (minPrice) whereClause.hourlyRate.gte = Number(minPrice);
      if (maxPrice) whereClause.hourlyRate.lte = Number(maxPrice);
    }

    // Experience level filter
    if (experienceLevel) {
      const expLevels = Array.isArray(experienceLevel)
        ? experienceLevel
        : [experienceLevel];
      const expRanges: any = [];

      expLevels.forEach((level: string) => {
        switch (level) {
          case "beginner":
            expRanges.push({ experienceYears: { gte: 0, lt: 2 } });
            break;
          case "intermediate":
            expRanges.push({ experienceYears: { gte: 2, lt: 5 } });
            break;
          case "advanced":
            expRanges.push({ experienceYears: { gte: 5, lt: 10 } });
            break;
          case "expert":
            expRanges.push({ experienceYears: { gte: 10 } });
            break;
        }
      });

      if (expRanges.length > 0) {
        whereClause.OR = whereClause.OR
          ? [...whereClause.OR, ...expRanges]
          : expRanges;
      }
    }

    // Location filter
    if (location) {
      whereClause.city = {
        contains: location as string,
        mode: "insensitive",
      };
    }

    // Languages filter
    if (languages && Array.isArray(languages) && languages.length > 0) {
      whereClause.languages = {
        hasEvery: languages as string[],
      };
    }

    // Availability filter (simplified - checks if teacher has any future availability)
    if (availability === "available") {
      whereClause.availabilitySlots = {
        some: {
          startTime: {
            gte: new Date(),
          },
          isBooked: false,
        },
      };
    }

    let orderBy: any;
    switch (sortBy) {
      case "rating":
        orderBy = { rating: sortOrder };
        break;
      case "price":
        orderBy = { hourlyRate: sortOrder };
        break;
      case "experience":
        orderBy = { experienceYears: sortOrder };
        break;
      case "reviews":
        orderBy = { totalReviews: sortOrder };
        break;
      default:
        orderBy = { createdAt: sortOrder };
    }

    const [teachers, totalCount] = await Promise.all([
      prisma.teacherProfile.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              createdAt: true,
            },
          },
          subjectOfferings: {
            select: {
              id: true,
              subjectName: true,
              level: true,
              pricePerHour: true,
            },
          },
          availabilitySlots: {
            where: {
              startTime: {
                gte: new Date(),
              },
              isBooked: false,
            },
            select: {
              id: true,
              startTime: true,
              endTime: true,
            },
            take: 5,
          },
          _count: {
            select: {
              reviews: {
                where: { status: "APPROVED" },
              },
              bookings: {
                where: { status: "COMPLETED" },
              },
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.teacherProfile.count({ where: whereClause }),
    ]);

    logger.info("Teacher search performed", {
      query,
      filters: { subjects, minRating, maxRating, minPrice, maxPrice },
      resultsCount: totalCount,
      userId: req.user!.id,
    });

    res.json({
      teachers,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
      appliedFilters: {
        query,
        subjects,
        minRating,
        maxRating,
        minPrice,
        maxPrice,
        experienceLevel,
        availability,
        location,
        languages,
      },
    });
  },
);

// Search students (Admin only)
router.get(
  "/students",
  requireRole("ADMIN"),
  validateQuery(studentSearchSchema),
  async (req, res) => {
    const {
      query,
      preferredSubjects,
      registrationDate,
      isActive,
      hasBookings,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 20,
    } = req.query;

    const skip = (page - 1) * limit;
    let whereClause: any = {
      user: {
        role: "STUDENT",
      },
    };

    // Text search
    if (query) {
      whereClause.OR = [
        {
          firstName: {
            contains: query as string,
            mode: "insensitive",
          },
        },
        {
          lastName: {
            contains: query as string,
            mode: "insensitive",
          },
        },
        {
          user: {
            email: {
              contains: query as string,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    // Active status filter
    if (isActive !== undefined) {
      whereClause.user.isActive = isActive === "true";
    }

    // Preferred subjects filter
    if (preferredSubjects && Array.isArray(preferredSubjects)) {
      whereClause.preferredSubjects = {
        hasEvery: preferredSubjects as string[],
      };
    }

    // Registration date filter
    if (registrationDate) {
      const date = new Date(registrationDate as string);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

      whereClause.user.createdAt = {
        gte: date,
        lt: nextDay,
      };
    }

    // Has bookings filter
    if (hasBookings === "true") {
      whereClause.bookings = {
        some: {},
      };
    } else if (hasBookings === "false") {
      whereClause.bookings = {
        none: {},
      };
    }

    let orderBy: any;
    switch (sortBy) {
      case "name":
        orderBy = { firstName: sortOrder };
        break;
      case "email":
        orderBy = { user: { email: sortOrder } };
        break;
      case "registrationDate":
        orderBy = { user: { createdAt: sortOrder } };
        break;
      default:
        orderBy = { createdAt: sortOrder };
    }

    const [students, totalCount] = await Promise.all([
      prisma.studentProfile.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              isActive: true,
              createdAt: true,
              lastLoginAt: true,
            },
          },
          _count: {
            select: {
              bookings: true,
              reviews: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.studentProfile.count({ where: whereClause }),
    ]);

    logger.info("Student search performed", {
      query,
      filters: { preferredSubjects, isActive, hasBookings },
      resultsCount: totalCount,
      adminId: req.user!.id,
    });

    res.json({
      students,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
      appliedFilters: {
        query,
        preferredSubjects,
        isActive,
        hasBookings,
        registrationDate,
      },
    });
  },
);

// Search subjects
router.get(
  "/subjects",
  requireAuth,
  validateQuery(subjectSearchSchema),
  async (req, res) => {
    const {
      query,
      category,
      hasTeachers,
      sortBy = "name",
      sortOrder = "asc",
      page = 1,
      limit = 50,
    } = req.query;

    const skip = (page - 1) * limit;
    let whereClause: any = {};

    // Text search
    if (query) {
      whereClause.OR = [
        {
          name: {
            contains: query as string,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query as string,
            mode: "insensitive",
          },
        },
        {
          category: {
            contains: query as string,
            mode: "insensitive",
          },
        },
      ];
    }

    // Category filter
    if (category) {
      whereClause.category = category as string;
    }

    // Has teachers filter
    if (hasTeachers === "true") {
      whereClause.subjectOfferings = {
        some: {},
      };
    } else if (hasTeachers === "false") {
      whereClause.subjectOfferings = {
        none: {},
      };
    }

    let orderBy: any;
    switch (sortBy) {
      case "popularity":
        orderBy = { subjectOfferings: { _count: sortOrder } };
        break;
      case "category":
        orderBy = { category: sortOrder };
        break;
      default:
        orderBy = { name: sortOrder };
    }

    const [subjects, totalCount, categories] = await Promise.all([
      prisma.subject.findMany({
        where: whereClause,
        include: {
          _count: {
            select: {
              subjectOfferings: true,
            },
          },
          subjectOfferings: {
            select: {
              id: true,
              level: true,
              pricePerHour: true,
              teacher: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  rating: true,
                },
              },
            },
            take: 3,
            orderBy: {
              teacher: {
                rating: "desc",
              },
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.subject.count({ where: whereClause }),

      // Get all categories for filtering
      prisma.subject.findMany({
        select: {
          category: true,
        },
        distinct: ["category"],
        orderBy: {
          category: "asc",
        },
      }),
    ]);

    logger.info("Subject search performed", {
      query,
      filters: { category, hasTeachers },
      resultsCount: totalCount,
      userId: req.user!.id,
    });

    res.json({
      subjects,
      categories: categories.map((c) => c.category),
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
      appliedFilters: {
        query,
        category,
        hasTeachers,
      },
    });
  },
);

// Advanced multi-criteria search
router.post(
  "/advanced",
  requireAuth,
  validateQuery(advancedFilterSchema),
  async (req, res) => {
    const {
      textQuery,
      teacherFilters,
      subjectFilters,
      locationFilters,
      availabilityFilters,
      priceFilters,
      ratingFilters,
      sortBy = "relevance",
      sortOrder = "desc",
      page = 1,
      limit = 20,
    } = req.body;

    const skip = (page - 1) * limit;

    try {
      // Build complex where clause
      let whereClause: any = {
        user: {
          isActive: true,
          role: "TEACHER",
        },
      };

      // Text search across multiple fields
      if (textQuery) {
        whereClause.OR = [
          {
            firstName: {
              contains: textQuery,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: textQuery,
              mode: "insensitive",
            },
          },
          {
            bio: {
              contains: textQuery,
              mode: "insensitive",
            },
          },
          {
            specializations: {
              has: textQuery,
            },
          },
          {
            subjectOfferings: {
              some: {
                subjectName: {
                  contains: textQuery,
                  mode: "insensitive",
                },
              },
            },
          },
        ];
      }

      // Apply teacher-specific filters
      if (teacherFilters) {
        if (teacherFilters.experienceYears) {
          whereClause.experienceYears = teacherFilters.experienceYears;
        }
        if (teacherFilters.education) {
          whereClause.education = {
            contains: teacherFilters.education,
            mode: "insensitive",
          };
        }
        if (teacherFilters.languages && teacherFilters.languages.length > 0) {
          whereClause.languages = {
            hasEvery: teacherFilters.languages,
          };
        }
      }

      // Apply subject filters
      if (
        subjectFilters &&
        subjectFilters.subjects &&
        subjectFilters.subjects.length > 0
      ) {
        whereClause.subjectOfferings = {
          some: {
            subjectName: {
              in: subjectFilters.subjects,
            },
            ...(subjectFilters.levels &&
              subjectFilters.levels.length > 0 && {
                level: {
                  in: subjectFilters.levels,
                },
              }),
          },
        };
      }

      // Apply location filters
      if (locationFilters) {
        if (locationFilters.city) {
          whereClause.city = {
            contains: locationFilters.city,
            mode: "insensitive",
          };
        }
        if (locationFilters.region) {
          whereClause.region = locationFilters.region;
        }
        if (locationFilters.country) {
          whereClause.country = locationFilters.country;
        }
      }

      // Apply price filters
      if (priceFilters) {
        const priceConditions: any = {};
        if (priceFilters.min !== undefined) {
          priceConditions.gte = priceFilters.min;
        }
        if (priceFilters.max !== undefined) {
          priceConditions.lte = priceFilters.max;
        }
        if (Object.keys(priceConditions).length > 0) {
          whereClause.hourlyRate = priceConditions;
        }
      }

      // Apply rating filters
      if (ratingFilters) {
        const ratingConditions: any = {};
        if (ratingFilters.min !== undefined) {
          ratingConditions.gte = ratingFilters.min;
        }
        if (ratingFilters.max !== undefined) {
          ratingConditions.lte = ratingFilters.max;
        }
        if (Object.keys(ratingConditions).length > 0) {
          whereClause.rating = ratingConditions;
        }
      }

      // Apply availability filters (simplified)
      if (availabilityFilters && availabilityFilters.requiredSlots) {
        whereClause.availabilitySlots = {
          some: {
            startTime: {
              gte: new Date(),
            },
            isBooked: false,
          },
        };
      }

      // Determine sorting
      let orderBy: any;
      switch (sortBy) {
        case "rating":
          orderBy = { rating: sortOrder };
          break;
        case "price":
          orderBy = { hourlyRate: sortOrder };
          break;
        case "experience":
          orderBy = { experienceYears: sortOrder };
          break;
        case "reviews":
          orderBy = { totalReviews: sortOrder };
          break;
        default:
          orderBy = { createdAt: sortOrder };
      }

      const [teachers, totalCount] = await Promise.all([
        prisma.teacherProfile.findMany({
          where: whereClause,
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
            subjectOfferings: {
              select: {
                id: true,
                subjectName: true,
                level: true,
                pricePerHour: true,
              },
            },
            availabilitySlots: {
              where: {
                startTime: {
                  gte: new Date(),
                },
                isBooked: false,
              },
              select: {
                id: true,
                startTime: true,
                endTime: true,
              },
              take: 5,
            },
            _count: {
              select: {
                reviews: {
                  where: { status: "APPROVED" },
                },
                bookings: {
                  where: { status: "COMPLETED" },
                },
              },
            },
          },
          orderBy,
          skip,
          take: limit,
        }),
        prisma.teacherProfile.count({ where: whereClause }),
      ]);

      logger.info("Advanced search performed", {
        textQuery,
        filters: {
          teacherFilters,
          subjectFilters,
          locationFilters,
          priceFilters,
          ratingFilters,
        },
        resultsCount: totalCount,
        userId: req.user!.id,
      });

      res.json({
        teachers,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit),
        },
        appliedFilters: {
          textQuery,
          teacherFilters,
          subjectFilters,
          locationFilters,
          availabilityFilters,
          priceFilters,
          ratingFilters,
        },
      });
    } catch (error) {
      logger.error("Advanced search error", { error });
      throw new AppError(
        "Advanced search failed",
        500,
        "ADVANCED_SEARCH_ERROR",
      );
    }
  },
);

// Get search suggestions/autocomplete
router.get("/suggestions", requireAuth, async (req, res) => {
  const { query, type = "all" } = req.query;

  if (!query || (query as string).length < 2) {
    return res.json({ suggestions: [] });
  }

  const suggestions: any = {
    teachers: [],
    subjects: [],
    locations: [],
  };

  try {
    // Teacher name suggestions
    if (type === "all" || type === "teachers") {
      const teachers = await prisma.teacherProfile.findMany({
        where: {
          OR: [
            {
              firstName: {
                startsWith: query as string,
                mode: "insensitive",
              },
            },
            {
              lastName: {
                startsWith: query as string,
                mode: "insensitive",
              },
            },
          ],
          user: {
            isActive: true,
          },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
        take: 5,
      });

      suggestions.teachers = teachers.map((t) => ({
        id: t.id,
        text: `${t.firstName} ${t.lastName}`,
        type: "teacher",
        avatar: t.avatar,
      }));
    }

    // Subject suggestions
    if (type === "all" || type === "subjects") {
      const subjects = await prisma.subject.findMany({
        where: {
          name: {
            startsWith: query as string,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          name: true,
          category: true,
        },
        take: 5,
      });

      suggestions.subjects = subjects.map((s) => ({
        id: s.id,
        text: s.name,
        type: "subject",
        category: s.category,
      }));
    }

    // Location suggestions
    if (type === "all" || type === "locations") {
      const locations = await prisma.teacherProfile.findMany({
        where: {
          city: {
            startsWith: query as string,
            mode: "insensitive",
          },
        },
        select: {
          city: true,
          region: true,
        },
        distinct: ["city"],
        take: 5,
      });

      suggestions.locations = locations.map((l) => ({
        text: l.city,
        type: "location",
        region: l.region,
      }));
    }

    res.json({ suggestions });
  } catch (error) {
    logger.error("Suggestions error", { error, query, type });
    res.json({ suggestions: [] });
  }
});

export default router;
