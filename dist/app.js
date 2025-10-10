import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rootRouter from './routes/rootRouter.js';
import tourRouter from './routes/tourRouter.js';
import userRouter from './routes/usersRouter.js';
// Query parse to parse the query
import qs from 'qs';
import { AppError } from './utils/AppError.js';
import { globalErrorHandler } from './controller/errorController.js';
dotenv.config({ path: 'config.env' });
const app = express();
app.use(express.json());
// setting up the query parser
app.set('query parser', (str) => qs.parse(str));
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use((req, res, next) => {
    req.requestTime = new Date().toString();
    next();
});
app.use('/', rootRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// Here the below route will only executes if no above route matches
app.all(/.*/, (req, res, next) => {
    next(new AppError(`No route match for ${req.originalUrl}`, 404));
});
// Global error handler (must be last)
app.use(globalErrorHandler);
export default app;
//# sourceMappingURL=app.js.map