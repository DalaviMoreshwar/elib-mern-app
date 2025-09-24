import app from "./src/app";
import { config } from "./src/config/config";

const initiateServer = () => {
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
