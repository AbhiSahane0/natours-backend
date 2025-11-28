import User from '../modules/UsersModule.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';
import { deleteOne } from './handlerFactory.js';
const allowedObject = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((key) => {
        if (allowedFields.includes(key)) {
            newObj[key] = obj[key];
        }
    });
    return newObj;
};
const getMe = catchAsync(async (req, res, next) => {
    req.params.id = req.user.id;
    next();
});
const getUsers = catchAsync(async (req, res) => {
    const users = await User.find();
    res.status(200).send({
        status: 'success',
        users,
    });
});
const updateUser = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm)
        return next(new AppError("You can't update password here. If you want to update password then go to /updatePassword", 404));
    const user = req.user;
    const updateObj = allowedObject(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateObj, {
        new: true,
        runValidators: true,
    });
    res.status(200).send({
        status: 'success',
        message: 'data updated!',
    });
});
const addUser = (req, res) => {
    res.status(200).send('user added');
};
const getUser = catchAsync(async (req, res) => {
    // console.log((req as any).user.id)
    const user = await User.find({ _id: req.user.id });
    res.status(200).send(user);
});
// const deleteUser = catchAsync(async (req: Request, res: Response) => {
//     const user = await User.findByIdAndUpdate((req as any).user._id, {
//         isActive: false,
//     })
//     res.status(200).send({
//         status: 'success',
//         message: 'User deleted :',
//     })
// })
const deleteUser = deleteOne(User);
export { getUsers, addUser, getUser, deleteUser, updateUser, getMe };
//# sourceMappingURL=usersController.js.map