const prisma = require("../utils/db");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await prisma.user.findMany();
  if (!users) return new AppError("no users", 404);
  res.status(200).json({
    status: "success",
    data: users,
  });
});

exports.getUser = async (req, res) => {
  try {
  } catch (error) {}
};

exports.createUser = async (req, res) => {
  try {
  } catch (error) {}
};

exports.updateUser = async (req, res) => {
  try {
  } catch (error) {}
};

exports.deleteUser = async (req, res) => {
  try {
  } catch (error) {}
};
