import { Request, Response } from 'express'
import { catchAsync } from '../utils/catchAsync.js'
import { AppError } from '../utils/AppError.js'

export const deleteOne = (Model: { deleteOne: (arg0: { _id: any }) => any }) =>
    catchAsync(async (req: Request, res: Response, next) => {
        const data = await Model.deleteOne({ _id: req.params.id })

        if (!data) {
            return next(new AppError('No record found with that Id', 404))
        }

        res.status(204).send({ data: data })
    })
