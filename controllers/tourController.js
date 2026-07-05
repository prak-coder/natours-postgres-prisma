const prisma = require("../utils/db");
const catchAsync = require("../utils/catchAsync");

const AppError = require("../utils/appError");

exports.getAllTours = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };

  const tours = await prisma.tour.findMany({
    where: query,
  });
  res.status(200).json({
    status: "success",
    numberoftours: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await prisma.tour.findFirst({
    where: {
      id: Number(req.params.id),
    },
  });
  if (!tour) {
    return next(new AppError("no tour with that id"));
  }
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

exports.createTour = async (req, res, next) => {
  try {
    const newTour = await prisma.tour.create({ data: req.body });

    res.status(200).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.updateTour = catchAsync(async (req, res, next) => {
  const id = req.params.id * 1;
  const updatedTour = await prisma.tour.update({
    where: {
      id,
    },
    data: req.body,
  });

  res.status(200).json({
    status: "success",
    tour: updatedTour,
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await prisma.tour.delete({
    where: {
      id: req.params.id * 1,
    },
  });
  res.status(204).json({
    status: "success",
    data: null,
  });
});
