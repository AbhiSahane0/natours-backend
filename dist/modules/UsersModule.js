import mongoose from 'mongoose';
import validator from 'validator';
import crypto from 'crypto';
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'You may have a name, Please share it.'],
        minLength: [3, 'A name must me atleast 3 charater long !'],
        maxLength: [
            15,
            'You got a really big name its not allowe ! name must be less than 15 character ',
        ],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [
            validator.isEmail,
            'Humm, Thats looks like invalid email please provide a correct one!',
        ],
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        minLength: [8, 'A password must be 6 character long'],
        maxLength: [15, 'A password should be less than 15 character'],
        select: false,
    },
    passwordConfirm: {
        type: String,
        require: [true, 'Please retype the password'],
        validate: {
            // This only works on Create and save
            validator: function (value) {
                return this.password === value;
            },
            message: 'Password is not matching',
        },
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'guide', 'senior-guide'],
        default: 'user',
    },
    passwordResetToken: {
        type: String,
        default: null,
        select: false,
    },
    passwordResetExpires: {
        type: Date,
        default: null,
        select: false,
    },
    isActive: {
        type: Boolean,
        select: false,
        default: true,
    },
});
// userSchema.pre('save', async function (this: any, next) {
//     if (!this.isModified('password')) return next()
//     console.log(this.password, this.passwordConfirm)
//     if (this.password !== this.passwordConfirm) {
//         return next(
//             new Error(
//                 'Passwords do not match! please check password and passwordConfirm '
//             )
//         )
//     }
//     this.password = await bcrypt.hash(this.password, 12)
//     this.passwordConfirm = undefined
//     next()
// })
userSchema.pre(/^find/, function (next) {
    this.find({ isActive: true });
    next();
});
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
const User = mongoose.model('User', userSchema);
export default User;
//# sourceMappingURL=UsersModule.js.map