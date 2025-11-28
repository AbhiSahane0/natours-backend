import { Request, Response } from 'express'
import { catchAsync } from '../utils/catchAsync.js'
import Review from '../modules/reviewModule.js'
import { deleteOne } from './handlerFactory.js'

export const getAllReviews = catchAsync(async (req: Request, res: Response) => {
    let filter = {}

    if (req.params.tourId) filter = { tour: req.params.tourId }

    console.log(filter)

    const reviews = await Review.find(filter)

    res.status(200).send({
        status: 'success',
        results: reviews.length,
        data: reviews,
    })
})

export const addNewReview = catchAsync(async (req: Request, res: Response) => {
    if (!req.body.tour) req.body.tour = req.params.tourId

    // if (!req.body.user) req.body.user = (req as any).user.id

    const review = await Review.create({
        review: req.body.review,
        rating: req.body.rating,
        tour: req.body.tour,
        user: req.body.user,
    })

    res.status(201).send({
        status: 'success',
        review: review,
    })
})

export const deleteReview = deleteOne(Review)
