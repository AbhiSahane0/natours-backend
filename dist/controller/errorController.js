import { AppError } from '../utils/AppError.js';
// helper
function handleCastErrorDB(err) {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}
function handleDuplicateFieldErrDB(err) {
    const value = err.keyValue ? JSON.stringify(err.keyValue) : 'unknown';
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
}
function handleValidationErrDB(err) {
    return new AppError(err.message, 400);
}
function handleInvalidTockenErr() {
    return new AppError('Your token is invalid,Please try to login again', 401);
}
export const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err,
        });
    }
    else if (process.env.NODE_ENV === 'production') {
        let error = Object.create(err);
        if (error.name === 'CastError') {
            error = handleCastErrorDB(error);
        }
        if (error.code === 11000) {
            error = handleDuplicateFieldErrDB(error);
        }
        if (error.name === 'ValidationError') {
            error = handleValidationErrDB(error);
        }
        if (error.name === 'invalid token') {
            error = handleInvalidTockenErr();
        }
        if (error.isOperational) {
            res.status(error.statusCode).json({
                status: error.status,
                message: error.message,
            });
        }
        else {
            res.status(500).json({
                status: 'error',
                message: 'Something went very wrong!',
            });
        }
    }
};
//# sourceMappingURL=errorController.js.map