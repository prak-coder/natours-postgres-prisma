const express = require("express");

const app = express();
//middle ware
app.use(express.json());

const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
