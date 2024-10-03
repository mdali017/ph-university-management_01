import mongoose from "mongoose";
import { TErrorSource } from "../Interface/error";

export const handleValidationError = (error: mongoose.Error.ValidationError) => {
  const errors: string[] = [];

  // Iterate over error.errors using Object.values
  Object.values(error.errors).forEach((err: any) => {
    errors.push(err.message);
  });

  const errorSources: TErrorSource[] = Object.values(error.errors).map((val: mongoose.Error.ValidatorError | any) => {
    return {
      path: val.path,
      message: val.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: "Validation Error",
    errorSources,
  };
};
