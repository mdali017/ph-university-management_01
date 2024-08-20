import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { AnyZodObject } from "zod";
import { studentValidations } from "../student/student.validation";
import validateRequest from "../../utils/validateRequests";

const router = express.Router();

// const validateRequest = (schema: AnyZodObject) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await schema.parseAsync({ body: req.body });
//       next();
//     } catch (error) {
//     //   console.log(error);
//       res.status(400).send(error); // Optionally, you can send an error response
//     }
//   };
// };

router.post(
  "/create-student",
  validateRequest(studentValidations.createStudentValidationSchema),
  UserController.createStudent
);

export const UserRoutes = router;
