import { NextFunction, Request, Response } from 'express'
import User from '../modules/UsersModule.js'
import { catchAsync } from '../utils/catchAsync.js'
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import { AppError } from '../utils/AppError.js'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

interface MyJwtPayload extends JwtPayload {
    id: string
}

const signTocken = (id: mongoose.Types.ObjectId) =>
    jwt.sign(
        { id: id.toString() },
        process.env.JWT_SECRET as string,
        {
            expiresIn: process.env.JWT_EXPIRES_IN, // "10d"
        } as SignOptions
    )

export const signUp = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        // Its a huge security flaw
        // const newUser = await User.create(req.body)
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            role: req.body.role,
        })
        const token = signTocken(newUser._id)

        res.status(201).send({
            status: 'success',
            token: token,
            data: newUser,
        })
    }
)

export const login = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body

        // 1 - Check if user has enterd a email and pass
        if (!email || !password) {
            return next(new AppError('Please enter a email and password', 400))
        }

        // 2 - check if user exists and if exists the pass is correct
        const user = await User.findOne({ email }).select('+password')

        if (!user || !(await bcrypt.compare(password, user.password!))) {
            return next(
                new AppError(
                    'Invalid email or password, please check it once',
                    401
                )
            )
        }
        // 3 - send token

        const token = signTocken(user._id)

        res.status(200).send({
            status: 'success',
            token,
        })
    }
)

export const protectRoute = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        // 1 - Check if tocken exists in req header
        let token: string | undefined
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1]
        }

        if (!token) {
            return next(
                new AppError(
                    'You are not logged in! Please log in to get access.',
                    401
                )
            )
        }

        const decoded = jwt.verify(token!, process.env.JWT_SECRET!)

        const user = await User.findById((decoded as MyJwtPayload).id)

        if (!user) {
            return next(
                new AppError(
                    'The user belonging to this token no longer exists.',
                    401
                )
            )
        }
        // here you can also check if user has changed there password
        ;(req as any).user = user

        next()
    }
)

export const restrictPath = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        if ((req as any).user.role !== 'admin') {
            return next(
                new AppError('You dont have permission to this route ', 401)
            )
        }
        next()
    }
)
