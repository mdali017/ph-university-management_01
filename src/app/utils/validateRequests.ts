import { NextFunction } from "express";
import { AnyZodObject } from "zod";

const validateRequest = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await schema.parseAsync({ body: req.body });
        next();
      } catch (error) {
      //   console.log(error);
       return res.status(400).send(error); 
      }
    };
  };


export default validateRequest;