import { z } from "zod";
// import { TGender, TBloodGroup } from "./faculty.interface";

// Zod schema for name
const NameSchema = z.object({
  firstName: z.string().nonempty("First name is required"),
  middleName: z.string().optional(), // Optional field
  lastName: z.string().nonempty("Last name is required"),
});

// Zod schema for gender and blood group
const GenderSchema = z.enum(["male", "female", "other"]);
const BloodGroupSchema = z.enum([
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
]);

// Validation Schema for Creating a Faculty
export const createFacultySchema = z.object({
  id: z.string().nonempty("ID is required"),
  user: z.string().nonempty("User ID is required"),
  designation: z.string().nonempty("Designation is required"),
  name: NameSchema,
  gender: GenderSchema,
  dateOfBirth: z.date().optional(),
  email: z.string().email("Invalid email format").nonempty("Email is required"),
  contactNo: z.string().nonempty("Contact number is required"),
  emergencyContactNo: z
    .string()
    .nonempty("Emergency contact number is required"),
  bloodGroup: BloodGroupSchema.optional(),
  presentAddress: z.string().nonempty("Present address is required"),
  permanentAddress: z.string().nonempty("Permanent address is required"),
  profileImage: z.string().optional(),
  academicDepartment: z.string().nonempty("Academic department ID is required"),
  isDeleted: z.boolean().optional().default(false),
});

// Validation Schema for Updating a Faculty (Partial)
export const updateFacultySchema = z.object({
  id: z.string().optional(),
  user: z.string().optional(),
  designation: z.string().optional(),
  name: NameSchema.partial(), // Partial to allow updating individual fields
  gender: GenderSchema.optional(),
  dateOfBirth: z.date().optional(),
  email: z.string().email("Invalid email format").optional(),
  contactNo: z.string().optional(),
  emergencyContactNo: z.string().optional(),
  bloodGroup: BloodGroupSchema.optional(),
  presentAddress: z.string().optional(),
  permanentAddress: z.string().optional(),
  profileImage: z.string().optional(),
  academicDepartment: z.string().optional(),
  isDeleted: z.boolean().optional(),
});
