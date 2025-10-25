import express, { urlencoded } from "express";
import createHttpError from "http-errors";
import globalErrorHander from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";
import cors from "cors";
import { config } from "./config/config";

const app = express();
app.use(
  cors({
    origin: config.frontendDomain,
  })
);
app.use(express.json());
app.use(urlencoded({ extended: false }));

// user register route
app.use("/api/users", userRouter);

// book routes
app.use("/api/books", bookRouter);

// global error handling [middleware]
app.use(globalErrorHander);

export default app;
