const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required: true
    },
   
      
    orderItems:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'orderItems',
        required:true
    }],
    orderDate:{
        type:Date,
        required: true,
        default: Date.now
    },
    email: {
        type: String,
        required: false, // or `true` if you want to enforce it
      },

    deliveryDate:{
        type:Date,
            },
    shippingAddress:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'address'
    },
    paymentDetails:{
        paymentMethod:{
            type: String,
        },
        transactionId:{
            type:String,
        },
        paymentId:{
            type:String,
        },
        paymentStatus:{
            type:String,
            default:'PENDING'
        },
    },
    totalPrice:{
        type:Number,
        required:true
    },
    totalDiscountedPrice:{
        type:Number,
        required: true
    },
    discount:{
        type:Number,
        required: true
    },
    orderStatus:{
        type:String,
        required: true,
        default: 'PENDING'
    },
    totalItems:{
        type:Number,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }


});
orderSchema.index({ user: 1, orderStatus: 1 });
const order = mongoose.model('orders',orderSchema)
module.exports = order;