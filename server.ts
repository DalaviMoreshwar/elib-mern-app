import app from "./src/app";
import { config } from "./src/config/config";
import connectDB from "./src/config/db";

const initiateServer = async () => {
  // connect database
  await connectDB();

  const port = config.port || 3210;

  // Routes
  app.get("/", (req, res) => {
    res.json({ message: "First Response!" });
  });

  app.listen(port, () => {
    console.log(`🚀 server initiated at port ${port}`);
  });
};

initiateServer();
