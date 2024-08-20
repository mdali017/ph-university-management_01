import { string } from "joi";
import config from "../../config";
import { TStudent } from "../student/student.interface";
import { TUser } from "./user.interface";
import { UserModel } from "./user.model";
import StudentModel from "../student/student.model";
import { TAcademicSemister } from "../academicSemester/academicSemester.interface";
import { AcademicSemesterModel } from "../academicSemester/academicSemester.model";
import generateStudentId from "./user.utils";

// const createStudentIntoDB = async (password: string, studentData: TStudent) => {
//   console.log(studentData);
//   // create a user object
//   const userData: Partial<TUser> = {};

//   // if password is not given, use default password
//   userData.password = password || (config.default_password as string);

//   // set user role
//   userData.role = "student";

//   // create a user
//   const newUser = await UserModel.create(userData);

//   // set manually generate id
//   userData.id = "203010";

//   // create a student
//   if (Object.keys(newUser).length) {
//     // set id, _id as user
//     studentData.id = newUser.id;
//     studentData.user = newUser._id;

//     const newStudent = await StudentModel.create(studentData);
//     return newStudent;
//   }
// };

const createStudentIntoDB = async (password: string, payload: TStudent) => {
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

  // Create a user
  const newUser = await UserModel.create(userData);

  // Create a student
  if (newUser) {
    // Set id and user fields for the student
    payload.id = newUser.id;
    payload.user = newUser._id;

    const newStudent = await StudentModel.create(payload);
    return newStudent;
  }
};

export const UserService = {
  createStudentIntoDB,
};
