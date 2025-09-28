import express from "express";
import createHttpError from "http-errors";
import globalErrorHander from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";

const app = express();
app.use(express.json());

// routes
app.get("/", (req, res, next) => {
  const error = createHttpError(400, "Somthing went wrong!");
  throw error;

  res.json({ message: "Winter is coming!" });
});

// user register route
app.use("/api/users", userRouter);

// book routes
app.use("/api/books", bookRouter);

// global error handling [middleware]
app.use(globalErrorHander);

export default app;
