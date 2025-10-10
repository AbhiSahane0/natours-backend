import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

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
            validator: function (this: any, value: string) {
                return this.password === value
            },
            message: 'Password is not matching',
        },
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'guide', 'senior-guide'],
        default: 'user',
    },
})

userSchema.pre('save', async function (this: any, next) {
    if (!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined

    next()
})

const User = mongoose.model('User', userSchema)

export default User
