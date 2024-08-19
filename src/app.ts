import express, { Application, Request, Response } from "express";
import cors from "cors";
import { StudentRoute } from "./app/modules/student/student.route";
import { UserRoutes } from "./app/modules/user/user.route";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFoundApi";
import router from "./app/routes";
const app: Application = express();

app.use(express.json());
app.use(cors());

// Application Route
// app.use("/api/v1/users", UserRoutes);
// app.use("/api/v1/students", StudentRoute);
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome To The Server !!!");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
