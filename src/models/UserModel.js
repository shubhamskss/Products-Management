const mongoose=require('mongoose')
const UserSchema=new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],},

    profileImage: {type:String,
        required:true,}, // s3 link
    phone: {type:String,
        required:true,
        unique:true,},
    password: {type:String,
        required:true,
        // minlength:8,
        // maxlength:15,
    }, // encrypted password
    address: {
      shipping: {
        street: {
            type:String,
            required:true,},
        city: {
            type:String,
            required:true,},

        pincode: {
            type:Number,
            required:true,
      },},
      billing: {
        street: {
            type:String,
            required:true,},
        city: {type:String,
            required:true,},
        pincode: {
            type:Number,
            required:true,
      },
    
  },
},
},{timestamps:true}
)
module.exports=mongoose.model("cartGroup2",UserSchema)