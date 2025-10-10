import mongoose from 'mongoose'

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tour must have a name'],
            unique: true,
            trim: true,
            maxLength: [25, 'Tour name must be less than 25 character'],
            minLength: [5, 'Tour name must be 5 Charater'],
        },
        // durationWeeks: String,
        duration: {
            type: Number,
            required: [true, 'A tour must have duration'],
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have max group size'],
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty must be : easy, medium, difficult',
            },
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be grater than 1'],
            max: [5, 'Ratings must be less than equal to 5'],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, 'Tour must have a price'],
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (this: any, val: number) {
                    return val < this.price
                },
                message: 'Discount should be less than price',
            },
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a description'],
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have a cover image'],
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            // This does not send this data to client only used by internally
            select: false,
        },
        startDates: [Date],
    },
    {
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: (_doc: any, ret: any) => {
                delete ret.id
                return ret
            },
        },
        toObjects: {
            virtuals: true,
            versionKey: false,
            transform: (_doc: any, ret: any) => {
                delete ret.id
                return ret
            },
        },
    }
)

tourSchema.virtual('durationWeeks').get(function () {
    if (this.duration) return this.duration / 7
})

//  Document middleware --> we can use it for validation
tourSchema.pre('save', function (next) {
    console.log('Document saved')
    next()
})

// Query middleware
// tourSchema.pre('find', function (next) {
//     console.log('find method called')
//     next()
// })

const Tour = mongoose.model('Tour', tourSchema)

export default Tour
