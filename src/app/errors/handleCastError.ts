import mongoose from "mongoose";
import { TErrorSource } from "../Interface/error";

export const handleCstError = (error: mongoose.Error.CastError) => {
  const statusCode = 400;
  const message = `Invalid ${error?.path}: ${error?.value}.`;

  const errorSources: TErrorSource[] = [
    // {
    //     path: 
    // }
  ];

  return {
    statusCode,
    message,
    errorSources: [],
  };
};
