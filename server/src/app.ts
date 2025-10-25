import express, { urlencoded } from "express";
import cors from "cors";

import { config } from "./config/config";
import globalErrorHander from "./middlewares/globalErrorHandler-middleware";

import userRouter from "./routes/user-router";
import bookRouter from "./routes/book-router";

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
