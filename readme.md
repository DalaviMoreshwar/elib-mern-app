# 🚀 MERN APP

## Backend Configuration

### Step 01

Initiate project with

```bash
yarn init
```

### Step 02

Configure `typescript`

```bash
yarn add -D typescript ts-node nodemon @types/node
```

initialize a `tsconfig` file

```bash
npx tsc --init
```

### Step 03

Initialize `.gitignore` file with the help of VS code extention `gitignore`.

### Step 04

Install `express` with types.

```bash
yarn add express

yarn add -D @types/express
```

### Step 05

Configure run envoirnment with `package.json`, `nodemon`, `tsconfig` files.

Add following scripts in `package.json`

```json
  "type": "commonjs",

  "scripts": {
    "dev": "nodemon"
  }
```

Create a `nodemon.json` file at root level of project and add following scripts.

```json
{
  "watch": ["server.ts"],
  "ext": "ts",
  "ignore": ["dist/*"],
  "exec": "ts-node ./server.ts"
}
```

Edit `tsconfig` file with following props.

```json
"module": "commonjs",
"esModuleInterop": true,
"target": "esnext",
"verbatimModuleSyntax": false,
```

... and all set!
