import { Request, Response } from "express";
import { StudentService } from "./student.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
// import studentValidationSchema from "./student.validation";

// const createStudent = async (req: Request, res: Response) => {
//   try {
//     const { student: studentData } = req.body;

//     // const { error } = studentValidationSchema.validate(studentData);
//     // if (error) {
//     //   // console.log(error.message);
//     //   return res.status(404).json({
//     //     success: false,
//     //     message: error.message,
//     //   });
//     // }

//     const zodParseData = studentValidationSchema.parse(studentData);

//     const result = await StudentService.createStudentIntoDB(zodParseData);

//     res.status(201).json({
//       success: true,
//       message: "Student Created Successfully !!!",
//       data: result,
//     });
//   } catch (error: any) {
//     console.log(error.message);
//     res.status(404).json({
//       success: false,
//       // message: error.message,
//       err: error,
//     });
//   }
// };

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentService.getAllStudentFromDB();
    res.status(200).json({
      success: true,
      message: "Students are retrieved Successfully !!!",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: "Student is not Deleted Successfully !!!",
      err: error.message,
    });
  }
};

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentService.getSingleStudentFromDB(studentId);
    res.status(200).json({
      success: true,
      message: "Student is retrieved Successfully !!!",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: "Student is not Deleted Successfully !!!",
      err: error.message,
    });
  }
};

const updateSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const { student } = req.body;
    const result = await StudentService.updateStudentIntoDB(studentId, student);

    if (!result) {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Student not found",
      });
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Student updated successfully !!!",
      data: result,
    });
  } catch (error: any) {
    res.status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to update student",
      err: error,
    });
  }
};

const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentService.deletedSingleStudentFromDB(studentId);
    res.status(201).json({
      success: true,
      message: "Student is Deleted Successfully !!!",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: "Student is not Deleted Successfully !!!",
      err: error.message,
    });
  }
};

export const StudentController = {
  // createStudent,
  getAllStudents,
  getSingleStudent,
  updateSingleStudent,
  deleteStudent,
};
