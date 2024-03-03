const express = require("express");
const { default: mongoose } = require("mongoose");

// Config imports
const expressConfig = require("./config/expressConfig");
const handlebarsConfig = require("./config/handlebarsConfig.js");

// App router import
const router = require("./routes");

// auth import
const { authMiddleware } = require("./middlewares/authMiddleware");

const app = express();

// Config middlewares
expressConfig(app);
handlebarsConfig(app);

// auth middleware
app.use(authMiddleware);

// router
app.use(router);

const port = 3000;

// Change DB Name!
mongoose
  .connect("mongodb://localhost:27017/", { dbName: "exam" })
  .then(() => {
    console.log("DB connected successfully!");
    app.listen(port, () => {
      console.log(
        `Server is listening on port ${port} - http://localhost:${port}`
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });