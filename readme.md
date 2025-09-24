# 🚀 MERN App

## Backend Setup Guide

This document provides step-by-step instructions for setting up a TypeScript-powered Node.js + Express backend for a MERN stack application.

### 📂 1. Project Initialization

Start by creating a new project

```bash
yarn init
```

This will generate a `package.json` file with default settings.

### ⚙️ 2. TypeScript & Development Tools

Install TypeScript, `ts-node`, `nodemon`, and Node.js type definitions:

```bash
yarn add -D typescript ts-node nodemon @types/node
```

Generate a default **TypeScript configuration file**:

```bash
npx tsc --init
```

### 📝 3. Git Configuration

Add a .gitignore file to exclude build artifacts and dependencies.

- If using VS Code, you can install the **gitignore extension** to quickly generate one.

### 📦 4. Express Installation

Install Express and its type definitions:

```bash
yarn add express

yarn add -D @types/express
```

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

### 🚀 6. Start the Server

Run the server in development mode:

```bash
yarn dev
```

... and all set!
