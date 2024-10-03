import { model, Schema } from "mongoose";
import { TAcademicDepartment } from "./academicDepartment.interface";

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: "AcademicFaculty",
    },
  },
  { timestamps: true }
);

class AppError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string, stack: "") {
    super(message);
    this.statusCode = statusCode;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// academicDepartmentSchema.pre("save", async function (next) {
//   const isDepartmentExist = await AcademicDepartmentModel.findOne({
//     name: this.name,
//   });
//   if (isDepartmentExist) {
//     throw new Error("This Department is already exits!");
//   }
//   next();
// });

academicDepartmentSchema.pre("findOneAndUpdate", async function (next) {
  const query = this.getQuery();
  const isDepartmentExist = await AcademicDepartmentModel.findOne(query);
  if (!isDepartmentExist) {
    // throw new Error("This Department does not exist!!");
    throw new AppError(404, "This Department does not exist !!");
  }
  // console.log(query);
  next();
});

export const AcademicDepartmentModel = model<TAcademicDepartment>(
  "AcademicDepartment",
  academicDepartmentSchema
);
