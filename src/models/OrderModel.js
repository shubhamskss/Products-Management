let mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
let orderSchema = new mongoose.Schema({


    userId: {
        type: ObjectId,
        required: true,
        ref: "cartGroup2"
    },
    items: [{
        productId: {
            type: ObjectId,
            ref: "products",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    totalItems: {
        type: Number,
        required: true
    },
    totalQuantity: {
        type: Number,
        required: true
    },
    cancellable: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        default: 'pending',
        enum: ["pending", "completed", "canceled"]
    },
    deletedAt: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },


}, { timestamps: true })
module.exports = mongoose.model("orderGroup2", orderSchema)