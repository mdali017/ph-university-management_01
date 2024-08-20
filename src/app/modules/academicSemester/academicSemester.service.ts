import { academicSemesterNameCodeMapper } from "./academicSemester.constant";
import { TAcademicSemister } from "./academicSemester.interface";
import { AcademicSemesterModel } from "./academicSemester.model";

// for create academin semester
const createAcademicSemesterIntoDB = async (payload: TAcademicSemister) => {
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error("Invalid Semester code");
  }

  const rersult = AcademicSemesterModel.create(payload);
  return rersult;
};

// get all academic semester
const getAllAcademicSemesterFromDB = async () => {
  const result = await AcademicSemesterModel.find();
  return result;
};

// get single academin semester
const getSingleAcademicSemesterFromDB = async (id: string) => {
  const result = await AcademicSemesterModel.findById(id);
  return result;
};

// for update
const updateAcademicSemesterIntoDB = async (
  id: string,
  payload: Partial<TAcademicSemister>
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new Error("Invalid Semester code");
  }

  const result = await AcademicSemesterModel.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true }
  );
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemesterFromDB,
  getSingleAcademicSemesterFromDB,
  updateAcademicSemesterIntoDB,
};
