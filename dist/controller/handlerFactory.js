import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';
export const deleteOne = (Model) => catchAsync(async (req, res, next) => {
    const data = await Model.deleteOne({ _id: req.params.id });
    if (!data) {
        return next(new AppError('No record found with that Id', 404));
    }
    res.status(204).send({ data: data });
});
//# sourceMappingURL=handlerFactory.js.map