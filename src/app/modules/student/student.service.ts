import { TStudent } from "./student.interface";
import StudentModel from "./student.model";

const createStudentIntoDB = async (student: TStudent) => {
  // const result = await StudentModel.create(student); // build in static method

  const studentInstance = new StudentModel(student); // custome instance methods

  const result = await studentInstance.save();

  return result;
};

const getAllStudentFromDB = async () => {
  const result = await StudentModel.find();
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await StudentModel.findOne({ id });
  return result;
};

const deletedSingleStudentFromDB = async (id: string) => {
  const result = await StudentModel.updateOne({ id }, { isDeleted: true });
  return result;
};

export const StudentService = {
  createStudentIntoDB,
  getAllStudentFromDB,
  getSingleStudentFromDB,
  deletedSingleStudentFromDB,
};
