import express, { urlencoded } from "express";
import cors from "cors";

import { config } from "./config/config.js";
import globalErrorHander from "./middlewares/globalErrorHandler-middleware.js";

import userRoutes from "./routes/user-router.js";
import bookRoutes from "./routes/book-router.js";

const app = express();

app.use(
  cors({
    origin: config.frontendDomain,
  })
);

/**
 * Parse incoming JSON payloads in a Node.js backend,
 * making the data accessible via req.body.
 */
app.use(express.json());

/**
 * URL-encoded:
 * used to parse incoming form data (URL-encoded payloads) into req.body,
 * allowing access to submitted form fields in a Node.js backend.
 *  */
app.use(urlencoded({ extended: false }));

// user register route
app.use("/api/users", userRoutes);

// book routes
app.use("/api/books", bookRoutes);

// global error handling [middleware]
app.use(globalErrorHander);

export default app;
