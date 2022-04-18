const mongoose=require ('mongoose')
const ObjectId = mongoose.Types.ObjectId  

const cartSchema = new mongoose.Schema({
   userId :{
       type:ObjectId,
       required:true,
       unique:true,
       ref:"cartGroup2"
   },
   items:[{
       productId:{
         type:ObjectId,
         required:true,
         ref:"products"
       },
       quantity:{
           type:Number,
           required:true,
           min:1
       }
   }],
   totalPrice:{
       type:Number,
       required:true
   },
   totalItems:{
       type:Number,
       required:true
   }
},
{timestamps:true})


module.exports=mongoose.model('cart',cartSchema);