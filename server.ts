import app from "./src/app";

const initiateServer = () => {
  const port = process.env.PORT || 3210;

  // Routes
  app.get("/", (req, res) => {
    res.json({ message: "First Response!" });
  });

  app.listen(port, () => {
    console.log(`🚀 server initiated at port ${port}`);
  });
};

initiateServer();
