const express = require("express");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();
//middle ware
app.use(express.json());

const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//routes that doesnot match any of previous routes for all methods get put patch delete
//*any" bcs of express 5
app.all("*any", (req, res, next) => {
  next(new AppError(`cant find the ${req.originalUrl} on this server`, 404));
});

//Global Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
