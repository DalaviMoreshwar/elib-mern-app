import express from "express";
import createHttpError from "http-errors";
import globalErrorHander from "./middlewares/globalErrorHandler";

const app = express();

// routes
app.get("/", (req, res, next) => {
  const error = createHttpError(400, "Somthing went wrong!");
  throw error;

  res.json({ message: "Winter is coming!" });
});

// global error handling [middleware]
app.use(globalErrorHander);

export default app;
