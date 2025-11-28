import { Request, Response, NextFunction } from 'express'
import Tour from '../modules/TourModule.js'
import {
    applyFilter,
    applySort,
    applyFields,
    applyPagination,
} from '../utils/apiFeatures.js'
import { AppError } from '../utils/AppError.js'
import { catchAsync } from '../utils/catchAsync.js'
import { deleteOne } from './handlerFactory.js'

export const tourAlias = (req: Request, _res: Response, next: NextFunction) => {
    req.url =
        '/?sort=-ratingsAverage,price&fields=ratingsAverage,price,name,difficulty,summary&limit=5'
    next()
}

export const getTours = catchAsync(async (req: Request, res: Response) => {
    let query = Tour.find()

    query = applyFilter(query, req.query as Record<string, any>)
    query = applySort(query, req.query.sort as string)
    query = applyFields(query, req.query.fields as string)
    query = applyPagination(
        query,
        req.query.page as string,
        req.query.limit as string
    )

    const data = await query
    // send data
    res.status(200).send({
        status: 'success',
        resultCount: data.length,
        data: data,
    })
})

export const AddNewTour = catchAsync(async (req: Request, res: Response) => {
    const data = await Tour.create(req.body)
    res.status(201).send({
        status: 'Created',
        data: data,
    })
})

export const getTourById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const data = await Tour.findById(req.params.id).populate('reviews')

        if (!data) {
            return next(new AppError('Tour not found', 404))
        }

        res.status(200).send({
            status: 'Success',
            data: [data],
        })
    }
)

export const updateTour = catchAsync(async (req: Request, res: Response) => {
    const data = await Tour.updateOne(
        { _id: req.params.id },

        req.body,
        // Important to run a validator
        {
            runValidators: true,
        }
    )

    res.send({
        status: 'success',
        data: data,
    })
})

// export const deleteTour = catchAsync(async (req: Request, res: Response) => {
//     const data = await Tour.deleteOne({ _id: req.params.id })

//     res.status(204).send({ data: data })
// })

export const deleteTour = deleteOne(Tour)

export const getStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                _id: '$difficulty',
                numTour: { $sum: 1 },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            },
        },
    ])
    res.status(200).send(stats)
})

export const getMonthlyPlan = catchAsync(
    async (req: Request, res: Response) => {
        const year = Number(req.params.year)

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates',
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-30`),
                    },
                },
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: '$name' },
                },
            },
            {
                $addFields: { month: '$_id' },
            },
            {
                $project: {
                    _id: 0,
                },
            },
            { $sort: { numTourStarts: -1 } },
        ])

        res.status(200).send(plan)
    }
)
