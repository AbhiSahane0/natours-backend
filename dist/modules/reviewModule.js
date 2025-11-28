import mongoose from 'mongoose';
const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review can not be empty'],
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a Tour'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to User'],
    },
}, {
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (_doc, ret) => {
            delete ret.id;
            return ret;
        },
    },
    toObjects: {
        virtuals: true,
        versionKey: false,
        transform: (_doc, ret) => {
            delete ret.id;
            return ret;
        },
    },
});
// Populating the fields
reviewSchema.pre(/^find/, function (next) {
    this.populate([
        {
            path: 'user',
            select: 'name photo',
            options: { populateGuides: false },
        },
        {
            path: 'tour',
            select: 'name',
            options: { populateGuides: false }, // Disable guides population
        },
    ]);
    next();
});
const Review = mongoose.model('Review', reviewSchema);
export default Review;
//# sourceMappingURL=reviewModule.js.map