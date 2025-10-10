import { Request, Response } from 'express'
import User from '../modules/UsersModule.js'
import { catchAsync } from '../utils/catchAsync.js'

declare module 'express-serve-static-core' {
    interface Request {
        requestTime?: string
    }
}

const getUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await User.find()

    res.status(200).send({
        status: 'success',
        users,
    })
})

const addUser = (req: Request, res: Response) => {
    res.status(200).send('user added')
}

const getUser = (req: Request, res: Response) => {
    res.status(200).send('User')
}

const updateUser = (req: Request, res: Response) => {
    res.status(200).send('User Updated')
}

const deleteUser = (req: Request, res: Response) => {
    res.status(200).send('User deleted')
}

export { getUsers, addUser, getUser, updateUser, deleteUser }
