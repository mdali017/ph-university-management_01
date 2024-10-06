import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import FacultyModel from "./faculty.model";
import { FacultyService } from "./faculty.service";

const getAllfaculty = catchAsync(async (req, res) => {
  const result = await FacultyService.getAllFacultysFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Facultys are Retrieved successfully !",
    data: result,
  });
});

const getSinglefaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FacultyService.getSingleFacultyFromDB(id);
  //await facultyService.getSinglefacultyFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single Facultys are Retrieved successfully !",
    data: result,
  });
});

const updateFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { faculty } = req.body;
  const result = await FacultyService.updateFacultyIntoDB(id, faculty);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Facultys are Updated successfully !",
    data: result,
  });
});

const deleteFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FacultyService.deleteFacultyFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Facultys are Deleted successfully !",
    data: result,
  });
});

export const FacultyController = {
  getAllfaculty,
  getSinglefaculty,
  updateFaculty,
  deleteFaculty,
};
