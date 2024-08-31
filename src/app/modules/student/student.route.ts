import express from "express";
import { StudentController } from "./student.controller";
import validateRequest from "../../utils/validateRequests";
import { studentValidations } from "./student.validation";
const router = express.Router();

// router.post("/create-student", StudentController.createStudent);
router.get("/", StudentController.getAllStudents);
router.get("/:studentId", StudentController.getSingleStudent);
router.patch(
  "/:studentId",
  validateRequest(studentValidations.updatedStudentValidationSchema),
  StudentController.updateSingleStudent
);
router.delete("/:studentId", StudentController.deleteStudent);

export const StudentRoute = router;
