import { Schema, model, connect } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import config from "../../config";
import { TStudent } from "./student.interface";

// Define the sub-schemas for Guardian, UserName, and LocalGuardian
const guardianSchema = new Schema({
  fatherName: { type: String },
  fatherOccupation: { type: String },
  fatherContactNo: { type: String },
  motherName: { type: String },
  motherOccupation: { type: String },
  motherContactNo: { type: String },
});

const userNameSchema = new Schema({
  firstName: { type: String },
  middleName: { type: String },
  lastName: { type: String },
});

const localGuardianSchema = new Schema({
  name: { type: String },
  occupation: { type: String },
  contactNo: { type: String },
  address: { type: String },
});

// Define the main student schema
const studentSchema = new Schema<TStudent>(
  {
    id: { type: String, unique: true },
    // password: { type: String },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "UserId is required"],
      unique: true,
    },
    name: { type: userNameSchema },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not valid",
      },
      required: true,
    },
    dateOfBirth: { type: String },
    email: {
      type: String,
      unique: true,
    },
    contactNo: { type: String },
    emergencyContactNo: { type: String },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    presentAddress: { type: String },
    permanentAddress: { type: String },
    guardian: { type: guardianSchema },
    localguardian: { type: localGuardianSchema },
    profileImage: { type: String },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: "AcademicSemester",
    },
    // isActive: {
    //   type: String,
    //   enum: ["active", "in-active"],
    //   default: "active",
    // },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

studentSchema.virtual("fullName").get(function () {
  return `${this.name?.firstName} ${this.name?.middleName} ${this.name?.lastName}`;
});

// // pre save middleware/ hook : will work on create() save()
// studentSchema.pre("save", async function (next) {
//   const user = this as any;
//   // hashing password and save into DB
//   user.password = await bcrypt.hash(
//     user.password,
//     Number(config.brcypt_salt_rounds)
//   );
//   next();
// });

// // post  save middleware / hook
// studentSchema.post("save", function (doc, next) {
//   (doc.password = ""),
//     // console.log(this, "post hook : We saved our data");
//     next();
// });

//  Query Middleware
studentSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Create and export the model
const StudentModel = model("Student", studentSchema);

export default StudentModel;
