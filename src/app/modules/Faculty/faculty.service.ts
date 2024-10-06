import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { FacultySearchableFields } from "./faculty.constant";
import { TFaculty } from "./faculty.interface";
import FacultyModel from "./faculty.model";
import { UserModel } from "../user/user.model";

const getAllFacultysFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(FacultyModel.find(), query)
    .search(FacultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await facultyQuery.modelQuery;
  return result;
};

const getSingleFacultyFromDB = async (id: string) => {
  const result = await FacultyModel.findById(id);
  return result;
};

const updateFacultyIntoDB = async (id: string, payload: Partial<TFaculty>) => {
  const { name, ...remainingFacultyData } = payload;
  const modifiedUpdateData: Record<string, unknown> = {
    ...remainingFacultyData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdateData[`name.${key}`] = value;
    }
  }

  const result = await FacultyModel.findByIdAndUpdate(id, modifiedUpdateData, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteFacultyFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const deletedFaculty = await FacultyModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedFaculty) {
      throw new Error("Failed to delete faculty");
    }

    // get user _id from deletedStudent
    const userId = deletedFaculty?.user;
    const deletedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isDeleted: true,
      },
      { new: true, session }
    );

    if (!deletedUser) {
      throw new Error("Failed to delete user");
    }

    await session.commitTransaction();
    session.endSession();
    return deletedFaculty;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error);
  }
};

export const FacultyService = {
  getAllFacultysFromDB,
  getSingleFacultyFromDB,
  updateFacultyIntoDB,
  deleteFacultyFromDB,
};
