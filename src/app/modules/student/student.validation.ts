import { z } from "zod";

// Guardian Schema
const guardianSchema = z.object({
  fatherName: z.string().nonempty("Father's name is required"),
  fatherOccupation: z.string().nonempty("Father's occupation is required"),
  fatherContactNo: z.string().nonempty("Father's contact number is required"),
  motherName: z.string().nonempty("Mother's name is required"),
  motherOccupation: z.string().nonempty("Mother's occupation is required"),
  motherContactNo: z.string().nonempty("Mother's contact number is required"),
});

// User Name Schema
const userNameSchema = z.object({
  firstName: z.string().nonempty("First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().nonempty("Last name is required"),
});

// Local Guardian Schema
const localGuardianSchema = z.object({
  name: z.string().nonempty("Local guardian's name is required"),
  occupation: z.string().nonempty("Local guardian's occupation is required"),
  contactNo: z.string().nonempty("Local guardian's contact number is required"),
  address: z.string().nonempty("Local guardian's address is required"),
});

// Create Student Validation Schema
const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(10),
    student: z.object({
      name: userNameSchema,
      gender: z.enum(["male", "female", "other"], {
        required_error: "Gender is required",
        invalid_type_error: "{VALUE} is not valid",
      }),
      dateOfBirth: z.string().optional(),
      email: z
        .string()
        .email("Invalid email address")
        .nonempty("Email is required"),
      contactNo: z.string().nonempty("Contact number is required"),
      emergencyContactNo: z
        .string()
        .nonempty("Emergency contact number is required"),
      bloodGroup: z
        .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
        .optional(),
      presentAddress: z.string().nonempty("Present address is required"),
      permanentAddress: z.string().nonempty("Permanent address is required"),
      guardian: guardianSchema,
      localguardian: localGuardianSchema,
      profileImage: z.string().optional(),
      admissionSemester: z.string().nonempty("Admission semester is required"),
      academicDepartment: z
        .string()
        .nonempty("Academic department is required"),
    }),
  }),
});

// Updated Student Validation Schema
const updatedStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(10).optional(),
    student: z
      .object({
        name: userNameSchema.partial(),
        gender: z.enum(["male", "female", "other"]).optional(),
        dateOfBirth: z.string().optional(),
        email: z.string().email("Invalid email address").optional(),
        contactNo: z.string().optional(),
        emergencyContactNo: z.string().optional(),
        bloodGroup: z
          .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
          .optional(),
        presentAddress: z.string().optional(),
        permanentAddress: z.string().optional(),
        guardian: guardianSchema.partial(),
        localguardian: localGuardianSchema.partial(),
        profileImage: z.string().optional(),
        admissionSemester: z.string().optional(),
        academicDepartment: z.string().optional(),
      })
      .partial(),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
  updatedStudentValidationSchema,
};
