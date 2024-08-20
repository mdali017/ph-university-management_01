import { NextFunction, Request, RequestHandler, Response } from "express";
import { UserService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

// const createStudent: RequestHandler = async (req, res, next) => {
//   try {
//     const { password, student: studentData } = req.body;
//     const result = await UserService.createStudentIntoDB(password, studentData);
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Academic Semester is create successfully !!",
//       data: result,
//     });
//   } catch (error: any) {
//     next(error);
//   }
// };

const createStudent: RequestHandler = catchAsync(async (req, res, _next) => {
  const { password, student: studentData } = req.body;
  const result = await UserService.createStudentIntoDB(password, studentData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic Semester is create successfully !!",
    data: result,
  });
});

export const UserController = {
  createStudent,
};
