import express from 'express';
import { getTours, getTourById, AddNewTour, updateTour, deleteTour, tourAlias, getStats, getMonthlyPlan, } from '../controller/tourController.js';
import { protectRoute, restrictPath } from '../controller/userAuthContoller.js';
import reviewRouter from './reviewRouter.js';
const tourRouter = express.Router();
// tourRouter.route('/:tourId/review').post(protectRoute, addNewReview)
tourRouter.use('/:tourId/review', reviewRouter);
// special route
tourRouter.route('/top-5-cheap').get(tourAlias, getTours);
// Aggrigation pipeline
tourRouter.route('/tours-stats').get(getStats);
tourRouter.route('/monthly-plan/:year').get(getMonthlyPlan);
// Normal routes
tourRouter.route('/').get(getTours).post(AddNewTour);
tourRouter
    .route('/:id')
    .get(getTourById)
    .patch(updateTour)
    .delete(protectRoute, restrictPath, deleteTour);
export default tourRouter;
//# sourceMappingURL=tourRouter.js.map