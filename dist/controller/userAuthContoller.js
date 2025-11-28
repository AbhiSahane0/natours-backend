import crypto from 'crypto';
import User from '../modules/UsersModule.js';
import { catchAsync } from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';
import bcrypt from 'bcrypt';
import sendEmail from '../utils/email.js';
const signTocken = (id) => jwt.sign({ id: id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
});
const createSendToken = (res, newUser) => {
    const token = signTocken(newUser._id);
    const cookieOptions = {
        expires: new Date(Date.now() +
            Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
        secure: false,
        httpOnly: true,
    };
    if (process.env.NODE_ENV === 'production')
        cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    res.status(201).send({
        status: 'success',
        token: token,
    });
};
export const signUp = catchAsync(async (req, res, next) => {
    // Its a huge security flaw
    // const newUser = await User.create(req.body)
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role,
    });
    createSendToken(res, newUser);
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
    createSendToken(res, user);
});
export const protectRoute = catchAsync(async (req, res, next) => {
    // 1 - Check if tocken exists in req header
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
        return next(new AppError('The user belonging to this token no longer exists.', 401));
    }
    // here you can also check if user has changed there password
    ;
    req.user = user;
    next();
});
export const restrictPath = catchAsync(async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return next(new AppError('You dont have permission to this route ', 401));
    }
    next();
});
export const forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    if (!email)
        return next(new AppError('Please enter your email', 404));
    const user = await User.findOne({ email });
    if (!user)
        return next(new AppError('No user registerd with this email', 404));
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${resetToken}`;
    const message = `Forgot your password, send an patch request to ${resetURL} ,If you didnt forgot your password then ignore this message`;
    try {
        await sendEmail({ email, message });
        res.status(200).send({
            status: 'success',
            message: 'Email send ',
        });
    }
    catch (err) {
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('Something went wrong', 500));
    }
});
export const resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    console.log(hashedToken);
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user)
        return next(new AppError('Invalid token or token is expired', 400));
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save({ validateBeforeSave: true });
    const token = signTocken(user._id);
    res.status(200).send({
        status: 'success',
        token,
    });
});
export const updateUserPassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('+password');
    const { currentPassword, password, passwordConfirm } = req.body;
    console.log(currentPassword, user.password);
    if (!(await bcrypt.compare(currentPassword, user.password)))
        return next(new AppError('Wrong password entered', 401));
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    await user.save({ validateBeforeSave: true });
    res.status(200).send({
        status: 'success',
        message: 'Password updated !',
    });
});
//# sourceMappingURL=userAuthContoller.js.map