import mongoose from "mongoose";
import { TStudent } from "./student.interface";
import StudentModel from "./student.model";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";
import { UserModel } from "../user/user.model";

// const createStudentIntoDB = async (student: TStudent) => {
//   // const result = await StudentModel.create(student); // build in static method

//   const studentInstance = new StudentModel(student); // custome instance methods

//   const result = await studentInstance.save();

//   return result;
// };

const getAllStudentFromDB = async () => {
  // const result = await StudentModel.find()
  //   .populate("admissionSemester")
  //   .populate("academicDepartment");
  const result = await StudentModel.find()
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await StudentModel.findOne({ id })
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });
  return result;
};

// for update student
const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  try {
    const { name, guardian, localguardian, ...remainingStudentData } = payload;

    const modifiedUpdatedData: Record<string, unknown> = {
      ...remainingStudentData,
    };

    // for name
    if (name && Object.keys(name).length) {
      for (const [key, value] of Object.entries(name)) {
        modifiedUpdatedData[`name.${key}`] = value;
      }
    }
    // for guardian
    if (guardian && Object.keys(guardian).length) {
      for (const [key, value] of Object.entries(guardian)) {
        modifiedUpdatedData[`guardian.${key}`] = value;
      }
    }
    // for local guardian
    if (localguardian && Object.keys(localguardian).length) {
      for (const [key, value] of Object.entries(localguardian)) {
        modifiedUpdatedData[`localguardian.${key}`] = value;
      }
    }
    const existingStudent = await StudentModel.findOne({ id });
    if (!existingStudent) {
      throw new AppError(httpStatus.NOT_FOUND, "Student not found");
    }

    const result = await StudentModel.findOneAndUpdate(
      { id },
      modifiedUpdatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    return result;
  } catch (error: any) {
    if (error.code === 11000) {
      // Duplicate key error
      throw new AppError(httpStatus.CONFLICT, "Student ID already exists");
    } else {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to update student"
      );
    }
  }
};

const deletedSingleStudentFromDB = async (id: string) => {
  const sesstion = await mongoose.startSession();

  try {
    sesstion.startTransaction();

    // const result = await StudentModel.updateOne({ id }, { isDeleted: true });
    const deletedStudent = await StudentModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, sesstion }
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failded to delete student");
    }

    const deletedUser = await UserModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, sesstion }
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failded to delete user");
    }

    await sesstion.commitTransaction();
    await sesstion.endSession();

    return deletedStudent;
  } catch (error) {
    await sesstion.abortTransaction();
    await sesstion.endSession();
  }
};

export const StudentService = {
  // createStudentIntoDB,
  getAllStudentFromDB,
  getSingleStudentFromDB,
  updateStudentIntoDB,
  deletedSingleStudentFromDB,
};
