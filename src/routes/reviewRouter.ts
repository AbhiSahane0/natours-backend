import express from 'express'
import {
    addNewReview,
    getAllReviews,
    deleteReview,
} from '../controller/reviewController.js'

const reviewRouter = express.Router({ mergeParams: true })

reviewRouter.get('/', getAllReviews)
reviewRouter.post('/addReview', addNewReview)

reviewRouter.delete('/:id', deleteReview)

export default reviewRouter
