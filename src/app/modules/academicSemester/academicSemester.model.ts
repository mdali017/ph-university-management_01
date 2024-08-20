import { model, Schema } from "mongoose";
import { TAcademicSemister } from "./academicSemester.interface";
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  Month,
} from "./academicSemester.constant";

const academicSemesterSchema = new Schema<TAcademicSemister>({
  name: {
    type: String,
    enum: AcademicSemesterName,
    required: true,
  },
  code: {
    type: String,
    enum: AcademicSemesterCode,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },

  startMonth: {
    type: String,
    enum: Month,
    required: true,
  },
  endMonth: {
    type: String,
    enum: Month,
    required: true,
  },
});

academicSemesterSchema.pre("save", async function (next) {
  const isSemesterExists = await AcademicSemesterModel.findOne({
    year: this.year,
    name: this.name,
  });

  if (isSemesterExists) {
    throw new Error("Semester is already exists !!");
  }
  next();
});

export const AcademicSemesterModel = model<TAcademicSemister>(
  "AcademicSemester",
  academicSemesterSchema
);
