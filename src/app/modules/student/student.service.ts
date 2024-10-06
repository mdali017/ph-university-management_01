import mongoose from "mongoose";
import { TStudent } from "./student.interface";
import StudentModel from "./student.model";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";
import { UserModel } from "../user/user.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { studentSearchableFields } from "./student.constant";

// const createStudentIntoDB = async (student: TStudent) => {
//   // const result = await StudentModel.create(student); // build in static method

//   const studentInstance = new StudentModel(student); // custome instance methods

//   const result = await studentInstance.save();

//   return result;
// };

const getAllStudentFromDB = async (query: Record<string, unknown>) => {
  // =========== previous code start here =========
  // const queryObj = { ...query };

  // // Extract search term from query
  // let searchTerm = "";
  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string;
  // }

  // // Searchable fields
  // const searchableFields = ["email", "name.firstName", "presentAddress"];

  // // Create search query based on the search term
  // const searchQuery = {
  //   $or: searchableFields.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: "i" },
  //   })),
  // };

  // // Filtering logic, removing fields that are not used for filtering
  // const excludedFields = ["searchTerm", "sort", "limit", "page"];
  // excludedFields.forEach((element) => delete queryObj[element]);

  // // Sorting logic
  // let sort = "-createdAt"; // Default sort by createdAt descending
  // if (query.sort) {
  //   sort = query.sort as string;
  // }

  // // Pagination logic
  // let page = 1;
  // let limit = 10; // Default limit
  // if (query.page) {
  //   page = Number(query.page as string); // Ensure it's parsed as a number
  // }
  // if (query.limit) {
  //   limit = parseInt(query.limit as string, 10); // Ensure it's parsed as a number
  // }
  // const skip = (page - 1) * limit;

  // // Final query with filters, sorting, pagination, and population
  // const result = await StudentModel.find({
  //   ...searchQuery,
  //   ...queryObj,
  // })
  //   .populate("admissionSemester")
  //   .populate({
  //     path: "academicDepartment",
  //     populate: {
  //       path: "academicFaculty",
  //     },
  //   })
  //   .sort(sort)
  //   .skip(skip) // Correctly applying the skip for pagination
  //   .limit(limit); // Applying the limit

  // return result;

  // =========== previous code start here =========

  const studentQuery = new QueryBuilder(
    StudentModel.find()
      .populate("admissionSemester")
      .populate({
        path: "academicDepartment",
        populate: {
          path: "academicFaculty",
        },
      }),
    query
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery;
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await StudentModel.findById({ id })
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

    const result = await StudentModel.findByIdAndUpdate(
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
    const deletedStudent = await StudentModel.findByIdAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, sesstion }
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failded to delete student");
    }

    // get user _id from deletedStudent
    const userId = deletedStudent?.user;

    const deletedUser = await UserModel.findByIdAndUpdate(
      { userId },
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
