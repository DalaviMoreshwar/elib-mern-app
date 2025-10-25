import express, { urlencoded } from "express";
import cors from "cors";

import { config } from "./config/config.js";
import globalErrorHander from "./middlewares/globalErrorHandler-middleware.js";

import userRouter from "./routes/user-router.js";
import bookRouter from "./routes/book-router.js";

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
