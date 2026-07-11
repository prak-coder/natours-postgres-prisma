const express = require("express");

const router = express.Router();

const tourController = require("../controllers/tourController");

router.route("/tour-stats").get(tourController.getTourStats);
router.route("/tour-monthly-plan/:year").get(tourController.getMonthlyPlan);

router
  .route("/top-5-cheaptours")
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
