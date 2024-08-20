// ----------- Joi Validation Start Here
import Joi from "joi";

// Define validation schema for sub-objects (Guardian, UserName, LocalGuardian)
const guardianValidationSchema = Joi.object({
  fatherName: Joi.string().required().messages({
    "string.empty": "Father's name is required",
  }),
  fatherOccupation: Joi.string().required().messages({
    "string.empty": "Father's occupation is required",
  }),
  fatherContactNo: Joi.string().required().messages({
    "string.empty": "Father's contact number is required",
  }),
  motherName: Joi.string().required().messages({
    "string.empty": "Mother's name is required",
  }),
  motherOccupation: Joi.string().required().messages({
    "string.empty": "Mother's occupation is required",
  }),
  motherContactNo: Joi.string().required().messages({
    "string.empty": "Mother's contact number is required",
  }),
});

const userNameValidationSchema = Joi.object({
  firstName: Joi.string().required().messages({
    "string.empty": "First name is required",
  }),
  middleName: Joi.string().optional(),
  lastName: Joi.string().alphanum().required().messages({
    "string.empty": "Last name is required",
    "string.alphanum": "{#value} is not a valid last name",
  }),
});

const localGuardianValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Local guardian's name is required",
  }),
  occupation: Joi.string().required().messages({
    "string.empty": "Local guardian's occupation is required",
  }),
  contactNo: Joi.string().required().messages({
    "string.empty": "Local guardian's contact number is required",
  }),
  address: Joi.string().required().messages({
    "string.empty": "Local guardian's address is required",
  }),
});

// Define the main validation schema
// const studentValidationSchema = Joi.object({
//   id: Joi.string().required().messages({
//     "string.empty": "Student ID is required",
//   }),
//   name: userNameValidationSchema.required().messages({
//     "object.base": "Student name is required",
//   }),
//   gender: Joi.string().valid("male", "female", "other").required().messages({
//     "any.only": "{#value} is not valid",
//     "string.empty": "Gender is required",
//   }),
//   dateOfBirth: Joi.string().required().messages({
//     "string.empty": "Date of birth is required",
//   }),
//   email: Joi.string().email().required().messages({
//     "string.empty": "Email address is required",
//     "string.email": "{#value} is not a valid email",
//   }),
//   contactNo: Joi.string().required().messages({
//     "string.empty": "Contact number is required",
//   }),
//   emergencyContactNo: Joi.string().required().messages({
//     "string.empty": "Emergency contact number is required",
//   }),
//   bloodGroup: Joi.string()
//     .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
//     .optional(),
//   presentAddress: Joi.string().required().messages({
//     "string.empty": "Present address is required",
//   }),
//   permanentAddress: Joi.string().required().messages({
//     "string.empty": "Permanent address is required",
//   }),
//   guardian: guardianValidationSchema.required().messages({
//     "object.base": "Guardian information is required",
//   }),
//   localguardian: localGuardianValidationSchema.required().messages({
//     "object.base": "Local guardian information is required",
//   }),
//   profileImage: Joi.string().optional(),
//   isActive: Joi.string().valid("active", "in-active").default("active"),
// });

// export default studentValidationSchema;

// ----------- Joi Validation End Here

// ------------ Zod Validation Start here

// Define the Zod schemas for Guardian, UserName, and LocalGuardian
import { z } from "zod";

// Define the Zod schemas for Guardian, UserName, and LocalGuardian
const guardianSchema = z.object({
  fatherName: z.string().nonempty("Father's name is required"),
  fatherOccupation: z.string().nonempty("Father's occupation is required"),
  fatherContactNo: z.string().nonempty("Father's contact number is required"),
  motherName: z.string().nonempty("Mother's name is required"),
  motherOccupation: z.string().nonempty("Mother's occupation is required"),
  motherContactNo: z.string().nonempty("Mother's contact number is required"),
});

const userNameSchema = z.object({
  firstName: z.string().nonempty("First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().nonempty("Last name is required"),
});

const localGuardianSchema = z.object({
  name: z.string().nonempty("Local guardian's name is required"),
  occupation: z.string().nonempty("Local guardian's occupation is required"),
  contactNo: z.string().nonempty("Local guardian's contact number is required"),
  address: z.string().nonempty("Local guardian's address is required"),
});

// Define the main Zod student schema
const createStudentValidationSchema = z.object({
  body: z.object({
    // id: z.string().nonempty("Student ID is required"),
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
      admissionSemester: z.string(),
    }),
    // isActive: z.enum(["active", "in-active"]).default("active"),
    // isDeleted: z.boolean().default(false),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
};

// ------------ Zod Validation End here
