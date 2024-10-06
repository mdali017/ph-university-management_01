import { z } from "zod";

const PreRequisiteCoursesValidatonSchema = z.object({
  course: z.string({ invalid_type_error: "Course must be string" }), // Expecting course to be an ObjectId string
  isDeleted: z.boolean().default(false).optional(),
});
const updatePreRequisiteCoursesValidatonSchema = z.object({
  course: z.string({ invalid_type_error: "Course must be string" }), // Expecting course to be an ObjectId string
  isDeleted: z.boolean().default(false).optional(),
});

const createCourseValidationSchema = z.object({
  body: z.object({
    title: z.string({ invalid_type_error: "Course name must be string" }),
    prefix: z.string({ invalid_type_error: "Course prefix must be string" }),
    code: z.number({ invalid_type_error: "Course code must be number" }),
    credits: z.number({ invalid_type_error: "Course credits must be number" }),
    preRequisiteCourses: z.array(PreRequisiteCoursesValidatonSchema).optional(),
    isDeleted: z.boolean().optional(),
  }),
});

const updatedCourseValidationSchema = z.object({
  body: z.object({
    title: z
      .string({ invalid_type_error: "Course name must be string" })
      .optional(),
    prefix: z
      .string({ invalid_type_error: "Course prefix must be string" })
      .optional(),
    code: z
      .number({ invalid_type_error: "Course code must be number" })
      .optional(),
    credits: z
      .number({ invalid_type_error: "Course credits must be number" })
      .optional(),
    preRequisiteCourses: z
      .array(updatePreRequisiteCoursesValidatonSchema)
      .optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const CourseValidations = {
  createCourseValidationSchema,
  updatedCourseValidationSchema,
};
