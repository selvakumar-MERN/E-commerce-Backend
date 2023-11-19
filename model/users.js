const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
    },
    email: {
        type: String,
        required: true,
        min: 3,
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    role: {
        type: String,
        default: 'user'
    },
    confirmPassword: {
        type: String,
        required: true,
        min: 6,
    },
    address: {
        type: String,
    },
    cart: [{
        productName: {
            type: String,
            min: 3,
            max: 225,
        },
        productId: {
            type: String,
        },
        category: {
            type: String,
            min: 3,
            max: 225,
        },
        productPrice: {
            type: String,
            min: 3,
            max: 225,
        },
        productImage: {
            type: String,
        },
        quantity: {
            type: Number,
            default: 1,
        },
    }],
    orderedItem: [{
        productName: {
            type: String,
        },
        productImage: {
            type: String,
        },
        productPrice: {
            type: String,
        },
        productId: {
            type: String,
        },
        quantity: {
            type: Number,

        },
        orderId: {
            type: String,
        },
        deliveryAddress: {
            type: String,
        },
        status: {
            type: String,
            default: "Order placed",
        },
        orderedDate: {
            type: Date,
            default: new Date
        },
        payment: {
            type: String,
            default: "Paid",
        }
    }],
    orderedList: [{
        userName: {
            type: String,
        },
        userEmail: {
            type: String,
        },
        productName: {
            type: String,
        },
        productPrice: {
            type: String,
        },
        productId: {
            type: String,
        },
        quantity: {
            type: Number,

        },
        orderId: {
            type: String,
        },
        deliveryAddress: {
            type: String,
        },
        status: {
            type: String,
            default: "Order placed",
        },
        orderedDate: {
            type: Date,
            default: new Date
        },
        payment: {
            type: String,
            default: "Paid",
        }
    }]

})
module.exports = mongoose.model("e-users", userSchema);