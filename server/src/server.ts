import app from "./app.js";
import { config } from "./config/config.js";
import connectDB from "./config/db.js";

const initiateServer = async () => {
  // connect to mongo database
  await connectDB();

  const port = config.port || 3210;

  // run server
  app.listen(port, () => {
    console.log(`🚀 server initiated at port ${port}`);
  });
};

initiateServer();
