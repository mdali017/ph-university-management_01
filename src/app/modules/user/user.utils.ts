import { TAcademicSemister } from "../academicSemester/academicSemester.interface";
import { UserModel } from "./user.model";

const findLastStudentId = async () => {
  const lastStudent = await UserModel.findOne(
    { role: "student" },
    { id: 1, _id: 0 }
  )
    .sort({ createdAt: -1 })
    .lean();

  return lastStudent?.id ? lastStudent.id.substring(6) : undefined;
};

const generateStudentId = async (payload: TAcademicSemister) => {
  // first time 0000
  const currentId = (await findLastStudentId()) || (0).toString();
  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");
  incrementId = `${payload.year}${payload.code}${incrementId}`;

  //   console.log(await findLastStudentId());

  return incrementId;
};

export default generateStudentId;
