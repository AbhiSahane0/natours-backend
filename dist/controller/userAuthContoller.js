import User from '../modules/UsersModule.js';
import { catchAsync } from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';
import bcrypt from 'bcrypt';
const signTocken = (id) => jwt.sign({ id: id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, // "10d"
});
export const signUp = catchAsync(async (req, res, next) => {
    // Its a huge security flaw
    // const newUser = await User.create(req.body)
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });
    const token = signTocken(newUser._id);
    res.status(201).send({
        status: 'success',
        token: token,
        data: newUser,
    });
});
export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    // 1 - Check if user has enterd a email and pass
    if (!email || !password) {
        return next(new AppError('Please enter a email and password', 400));
    }
    // 2 - check if user exists and if exists the pass is correct
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError('Invalid email or password, please check it once', 401));
    }
    // 3 - send token
    const token = signTocken(user._id);
    res.status(200).send({
        status: 'success',
        token,
    });
});
export const protectRoute = catchAsync(async (req, res, next) => {
    // 1 - Check if tocken exists in req header
    let token;
    if (req.headers)
        token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    next();
});
//# sourceMappingURL=userAuthContoller.js.map