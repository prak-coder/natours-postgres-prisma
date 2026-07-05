class PrismaAPIFeatures {
  constructor(queryString) {
    this.queryString = queryString;
    this.queryArgs = {}; // This will hold where, orderBy, select, skip, and take
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    const where = {};

    // Handle advanced filtering (gte, gt, lte, lt)
    Object.keys(queryObj).forEach((key) => {
      const val = queryObj[key];

      if (typeof val === "object" && val !== null) {
        where[key] = {};
        Object.keys(val).forEach((operator) => {
          // Check for valid numbers or dates if needed, otherwise pass directly
          const numericVal = Number(val[operator]);
          where[key][operator] = isNaN(numericVal) ? val[operator] : numericVal;
        });
      } else {
        // Handle simple filtering (e.g., difficulty=easy)
        const numericVal = Number(val);
        where[key] = isNaN(numericVal) ? val : numericVal;
      }
    });

    this.queryArgs.where = where;
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      // Input: "price,-ratingsAverage" -> Output: [{ price: 'asc' }, { ratingsAverage: 'desc' }]
      this.queryArgs.orderBy = this.queryString.sort.split(",").map((field) => {
        if (field.startsWith("-")) {
          return { [field.substring(1)]: "desc" };
        }
        return { [field]: "asc" };
      });
    } else {
      // Default sorting
      this.queryArgs.orderBy = { createdAt: "desc" };
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      // Input: "name,price" -> Output: { name: true, price: true }
      const select = {};
      this.queryString.fields.split(",").forEach((field) => {
        select[field] = true;
      });
      this.queryArgs.select = select;
    }
    // Note: Prisma does not select '__v' by default because it doesn't exist in Postgres!
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.queryArgs.skip = skip;
    this.queryArgs.take = limit;

    return this;
  }
}

module.exports = PrismaAPIFeatures;
exports.getAllTours = catchAsync(async (req, res, next) => {
  // 1. Instantiate the new Prisma features class
  const features = new PrismaAPIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // 2. Pass the generated query arguments directly into findMany
  const tours = await prisma.tour.findMany(features.queryArgs);

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: { tours },
  });
});
