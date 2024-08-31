import { TAcademicSemister } from "../academicSemester/academicSemester.interface";
import { UserModel } from "./user.model";

const findLastStudentId = async () => {
  const lastStudent = await UserModel.findOne(
    { role: "student" },
    { id: 1, _id: 0 }
  )
    .sort({ createdAt: -1 })
    .lean();

  return lastStudent?.id ? lastStudent.id : undefined;
};

const generateStudentId = async (payload: TAcademicSemister) => {
  // first time 0000
  //   const currentId = (await findLastStudentId()) || (0).toString();
  let currentId = (0).toString(); // by default

  const lastStudentId = await findLastStudentId();
  //   2030 01 0001
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6); // 01
  const lastStudentYear = lastStudentId?.substring(0, 4); // 2030
  const currentSemesterCode = payload.code;
  const currentYear = payload.year;

  if (
    lastStudentId &&
    lastStudentSemesterCode === currentSemesterCode &&
    lastStudentYear === currentYear
  ) {
    currentId = lastStudentId.substring(6); // 0001
  }

  //   if (lastStudentId)
  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");
  incrementId = `${payload.year}${payload.code}${incrementId}`;

  //   console.log(await findLastStudentId());

  return incrementId;
};

export default generateStudentId;
