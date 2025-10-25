import app from "./app";
import { config } from "./config/config";
import connectDB from "./config/db";

const initiateServer = async () => {
  // connect database
  await connectDB();

  const port = config.port || 3210;

  app.listen(port, () => {
    console.log(`🚀 server initiated at port ${port}`);
  });
};

initiateServer();
