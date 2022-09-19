require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pageRoute = require("./routes/page");
const editorRoute = require("./routes/editor");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/v1/page", pageRoute);
app.use("/api/v1/editor", editorRoute);

const start = () => {
  app.listen(port, console.log(`Server is listening to port ${port}...`));
};

start();
