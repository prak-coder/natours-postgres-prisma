const AppError = require("../utils/appError");

const handlePrismaNotFoundError = (err) => {
  return new AppError("No record found with that ID", 404);
};

// const handleCastErrorDB = (err) => {
//   const message = `Invalid ${err.path} : ${err.value}`;
//   return new AppError(message, 404);
// };

// const handleDuplicateFieldsDB = (err) => {
//   // 1. Safe regex match execution
//   const match = err.message.match(/(["'])(\\?.)*?\1/);

//   // 2. Fallback to empty string if no match is found, otherwise strip quotes
//   const value = match ? match[0] : "";
//   const message = `duplicate field value: ${value}. Please use another value`;
//   return new AppError(message, 404);
// };

// const handleValidationErrorDB = (err) => {
//   const errors = Object.values(err.errors).map((el) => el.message);
//   console.log(errors);
//   const message = `invalid input data. ${errors.join(". ")}`;
//   return new AppError(message, 404);
// };

// // eslint-disable-next-line no-unused-vars
// const handleJWTError = (err) =>
//   new AppError("Invalid token Please login again", 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error("ERROR 💥", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err }; //shallow copy Properties such as name, message, and stack are configured as non-enumerable
    error.name = err.name;
    error.message = err.message;

    if (err.code === "P2025") error = handlePrismaNotFoundError();
    // if (err.name === "CastError") error = handleCastErrorDB(error);
    // if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    // if (err.name === "ValidationError") error = handleValidationErrorDB(error);
    // if (err.name === "JsonWebTokenError") error = handleJWTError(error);

    sendErrorProd(error, res);
  }
  next();
};
