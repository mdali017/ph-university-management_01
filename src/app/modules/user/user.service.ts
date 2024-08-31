// import { string } from "joi";
import config from "../../config";
import { TStudent } from "../student/student.interface";
import { TUser } from "./user.interface";
import { UserModel } from "./user.model";
import StudentModel from "../student/student.model";
import { TAcademicSemister } from "../academicSemester/academicSemester.interface";
import { AcademicSemesterModel } from "../academicSemester/academicSemester.model";
import generateStudentId from "./user.utils";
import mongoose from "mongoose";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // Create a user object
    const userData: Partial<TUser> = {};

    // If password is not given, use the default password
    userData.password = password || (config.default_password as string);

    // Set user role
    userData.role = "student";

    // find academic semester info
    const admissionSemester = await AcademicSemesterModel.findById(
      payload.admissionSemester
    );

    // send studentId
    userData.id = await generateStudentId(admissionSemester);

    // Create a user (transaction-1)
    const newUser = await UserModel.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }

    // Create a student
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    // create a student (transaction-2)
    const newStudent = await StudentModel.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create student");
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error; // Re-throw the error to propagate it
  }
};

export const UserService = {
  createStudentIntoDB,
};
