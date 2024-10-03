import { ErrorRequestHandler } from "express";
import { ZodError, ZodIssue } from "zod";
import mongoose from "mongoose";
import { TErrorSource } from "../Interface/error";
import config from "../config";
import { handleZodError } from "../errors/handleZodError";
import { handleValidationError } from "../errors/handleValidationError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // setting default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let errorSources: TErrorSource = [];

  // Check if the error is a ZodError
  if (err instanceof ZodError) {
    let simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
    message = "Validation failed";
  }

  // Check if the error is a Mongoose ValidationError
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400; // Validation errors typically return 400
    message = "Mongoose validation failed";
    errorSources = Object.values(err.errors).map((error) => ({
      path: error.path,
      message: error.message,
    }));
  } else if (err?.name === "ValidationError") {
    console.log("Ami mongoose er validation error ! bujsi vaia");
    handleValidationError(err);
  }else if (err instanceof mongoose.Error.CastError) {
    
  }

  // Other types of errors can be handled here...

  return res.status(statusCode).json({
    success: false,
    message: message,
    errorSources,
    amiError: err,
    stack: config.Node_env === "development" ? err.stack : null,
  });
};

export default globalErrorHandler;
