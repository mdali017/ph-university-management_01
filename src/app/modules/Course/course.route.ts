import express from "express";
import validateRequest from "../../utils/validateRequests";
import { CourseValidations } from "./course.validation";
import { CourseControllers } from "./course.controller";

const router = express.Router();

router.post(
  "/create-course",
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse
);

router.get("/", CourseControllers.getAllCourses);
router.get("/:id", CourseControllers.getSingleCourse);
router.patch(
  "/:id",
  validateRequest(CourseValidations.updatedCourseValidationSchema),
  CourseControllers.updateCourse
);
router.delete("/:id", CourseControllers.deleteCourse);

router.put(
  "/:courseId/assign-faculties",
  CourseControllers.assignFacultiesWithCourse
);

export const CourseRoute = router;
