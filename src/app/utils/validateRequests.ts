import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodOptional } from "zod";

const validateRequest = (schema: AnyZodObject | ZodOptional<AnyZodObject>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({ body: req.body });
      next();
    } catch (error) {
      return res.status(400).send(error);
    }
  };
};

export default validateRequest;
