const prisma = require("../utils/db");
const catchAsync = require("../utils/catchAsync");

const AppError = require("../utils/appError");

const PrismaAPIFeatures = require("../utils/PrismaAPIFeatures");

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new PrismaAPIFeatures(req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate();
  const tours = await prisma.tour.findMany(features.queryArgs);

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

exports.getTourStats = catchAsync(async (req, res, next) => {
  // 1. Run global aggregation over the filtered dataset
  const aggregateResult = await prisma.tour.aggregate({
    where: {
      ratingsAverage: {
        gte: 4.5,
      },
    },
    _count: {
      id: true, // Maps to numTours (assuming primary key is 'id')
    },
    _sum: {
      ratingsQuantity: true, // Maps to numRatings
    },
    _avg: {
      ratingsAverage: true, // Maps to avgRatings
      price: true, // Maps to avgPrice
    },
    _max: {
      price: true, // Maps to maxPrice
    },
    _min: {
      price: true, // Maps to minPrice
    },
    // Note: $sort and $limit are not applicable here because
    // global aggregate queries in SQL always return exactly 1 row.
  });
  const tourStats = {
    numTours: aggregateResult._count.id,
    numRatings: aggregateResult._sum.ratingsQuantity || 0,
    avgRatings: aggregateResult._avg.ratingsAverage || 0,
    avgPrice: aggregateResult._avg.price || 0,
    maxPrice: aggregateResult._max.price || 0,
    minPrice: aggregateResult._min.price || 0,
  };

  // 3. Return the response
  res.status(200).json({
    status: "success",
    data: tourStats,
  });
});
