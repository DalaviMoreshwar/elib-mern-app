# 🚀 MERN App

## Backend Setup Guide

This document provides step-by-step instructions for setting up a TypeScript-powered Node.js + Express backend for a MERN stack application.

---

### 📂 1. Project Initialization

Start by creating a new project

```bash
yarn init
```

This will generate a `package.json` file with default settings.

---

### ⚙️ 2. TypeScript & Development Tools

Install TypeScript, `ts-node`, `nodemon`, and Node.js type definitions:

```bash
yarn add -D typescript ts-node nodemon @types/node
```

Generate a default **TypeScript configuration file**:

```bash
npx tsc --init
```

---

### 📝 3. Git Configuration

Add a `.gitignore` file to exclude build artifacts and dependencies.

- If using VS Code, you can install the **gitignore extension** to quickly generate one.

---

### 📦 4. Express Installation

Install Express and its type definitions:

```bash
yarn add express

yarn add -D @types/express
```

---

### 🔧 5. Runtime Configuration

`package.json`

Update your `package.json` with the following:

```json
  "type": "commonjs",

  "scripts": {
    "dev": "nodemon"
  }
```

`nodemon.json`

Create a `nodemon.json` file in the project root:

```json
{
  "watch": ["server.ts"],
  "ext": "ts",
  "ignore": ["dist/*"],
  "exec": "ts-node ./server.ts"
}
```

This tells **nodemon** to watch `.ts` files, ignore compiled output, and execute via `ts-node`.

`tsconfig.json`

Update key options in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "esModuleInterop": true,
    "target": "esnext",
    "verbatimModuleSyntax": false
  }
}
```

- `"verbatimModuleSyntax": false` → allows using import/export syntax even in CommonJS mode.

- `"esModuleInterop": true` → ensures compatibility with CommonJS modules like Express.

- `"target": "esnext"` → compiles to modern JavaScript.

---

### 🚀 6. Start the Server

Run the server in development mode:

```bash
yarn dev
```

---

### 🌱 7. Environment Variables

Install `dotenv` to manage environment variables:

```bash
yarn add dotenv

yarn add -D @types/dotenv
```

---

### 🗄️ 8. MongoDB + Mongoose Integration

Install Dependencies

```bash
yarn add mongoose

yarn add -D @types/mongoose
```

`db.ts`

```typescript
import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log(`🫱🏻‍🫲🏻 Database handshake success!`);
    });

    mongoose.connection.on("error", (error) => {
      console.log(`Error in connecting database -  ${error}`);
    });

    await mongoose.connect(config.databaseUrl as string);
  } catch (error) {
    console.log(`Failed to connect database: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
```

---

### ⚠️ 9. Global Error Handling Setup

```bash
yarn add http-errors

yarn add -D @types/http-errors
```

Usage of `http-errors` package and middleware function.

```typescript
import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/config";

const globalErrorHander = (
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    message: error.message,
    errorStack: config.env === "dev" ? error.stack : "",
  });
};

export default globalErrorHander;
```
