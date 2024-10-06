import { model, Schema } from "mongoose";
import { TFaculty } from "./faculty.interface";

const facultySchema = new Schema<TFaculty>({
  id: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  designation: { type: String, required: true },
  name: {
    firstName: { type: String, required: true },
    middleName: { type: String, required: false },
    lastName: { type: String, required: true },
  },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  dateOfBirth: { type: Date, required: false },
  email: { type: String, required: true },
  contactNo: { type: String, required: true },
  emergencyContactNo: { type: String, required: true },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: false,
  },
  presentAddress: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  profileImage: { type: String, required: false },
  academicDepartment: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  isDeleted: { type: Boolean, default: false },
});

// Mongoose Model
const FacultyModel = model<TFaculty>("Faculty", facultySchema);

export default FacultyModel;
