import { NextFunction, Request, Response } from 'express'
import User from '../modules/UsersModule.js'
import { catchAsync } from '../utils/catchAsync.js'
import { AppError } from '../utils/AppError.js'
import { deleteOne } from './handlerFactory.js'

declare module 'express-serve-static-core' {
    interface Request {
        requestTime?: string
    }
}

const allowedObject = <T extends object>(
    obj: T,
    ...allowedFields: (keyof T)[]
) => {
    const newObj: Partial<T> = {}

    Object.keys(obj).forEach((key) => {
        if (allowedFields.includes(key as keyof T)) {
            newObj[key as keyof T] = obj[key as keyof T]
        }
    })

    return newObj
}

const getMe = catchAsync(async (req: Request, res: Response, next) => {
    req.params.id = (req as any).user.id
    next()
})

const getUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await User.find()

    res.status(200).send({
        status: 'success',
        users,
    })
})

const updateUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        if (req.body.password || req.body.passwordConfirm)
            return next(
                new AppError(
                    "You can't update password here. If you want to update password then go to /updatePassword",
                    404
                )
            )

        const user = (req as any).user

        const updateObj = allowedObject(req.body, 'name', 'email')

        const updatedUser = await User.findByIdAndUpdate(
            (req as any).user._id,
            updateObj,
            {
                new: true,
                runValidators: true,
            }
        )

        res.status(200).send({
            status: 'success',
            message: 'data updated!',
        })
    }
)

const addUser = (req: Request, res: Response) => {
    res.status(200).send('user added')
}

const getUser = catchAsync(async (req: Request, res: Response) => {
    // console.log((req as any).user.id)
    const user = await User.find({ _id: (req as any).user.id })

    res.status(200).send(user)
})
// const deleteUser = catchAsync(async (req: Request, res: Response) => {
//     const user = await User.findByIdAndUpdate((req as any).user._id, {
//         isActive: false,
//     })

//     res.status(200).send({
//         status: 'success',
//         message: 'User deleted :',
//     })
// })

const deleteUser = deleteOne(User)

export { getUsers, addUser, getUser, deleteUser, updateUser, getMe }
