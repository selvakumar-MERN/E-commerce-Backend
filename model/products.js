const mongoose= require("mongoose");
const productSchema= new mongoose.Schema({
    productName:{
        type:String,
        required:true,
        min:3,
        max:225,
    },
    productId:{
        type:String,
    },
    category:{
        type:String,
        required:true,
        min:3,
        max:225,
    },
    productPrice:{
        type:String,
        required:true,
        min:3,
        max:225,
    },
    productImage:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        default:1,
    },
    userName:{
        type:String,

    },
    email:{
        type:String,
    },
    rating:{
        type:Number,
        default:0,
    },
    review:[{
        userName:{
            type:String,
        },
        rating:{
            type:Number,
        },
        reviewTitle:{
            type:String,
        },
        review:{
            type:String,
        }
    }]

    

})

module.exports=mongoose.model('e-products',productSchema);