import express, { Application, Request, Response } from "express";
import cors from "cors";
import { StudentRoute } from "./app/modules/student/student.route";
const app: Application = express();

app.use(express.json());
app.use(cors());

// Application Route
app.use("/api/v1/students", StudentRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome To The Server !!!");
});

export default app;
