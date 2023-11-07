const express = require('express');
const tourController = require('../controllers/tourController');

const route = express.Router(); //middleware

//Tour Route
route.route('/').get(tourController.getAllTour).post(tourController.createTour);
route
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = route;
