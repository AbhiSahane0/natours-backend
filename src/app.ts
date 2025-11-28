import express from 'express'
import { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
// import ExpressMongoSanitize from 'express-mongo-sanitize'
import hpp from 'hpp'

import rootRouter from './routes/rootRouter.js'
import tourRouter from './routes/tourRouter.js'
import userRouter from './routes/usersRouter.js'
import reviewRouter from './routes/reviewRouter.js'

// Query parse to parse the query
import qs from 'qs'

import { AppError } from './utils/AppError.js'
import { globalErrorHandler } from './controller/errorController.js'

dotenv.config({ path: 'config.env' })

const app = express()

app.use(helmet())

app.use(express.json({ limit: '10kb' }))

// setting up the query parser
app.set('query parser', (str: string) => qs.parse(str))

// Preventing No sql query injection
// app.use(ExpressMongoSanitize())

//  Data sanitation against XSSA
// app.use(xss())

// Preventing parameter pollution
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price',
        ],
    })
)

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use((req: Request, res: Response, next: NextFunction) => {
    req.requestTime = new Date().toString()
    next()
})

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, Try after one hour :',
})

app.use('/api', limiter)

app.use('/', rootRouter)
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)

// Here the below route will only executes if no above route matches

app.all(/.*/, (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`No route match for ${req.originalUrl}`, 404))
})

// Global error handler (must be last)
app.use(globalErrorHandler)

export default app
