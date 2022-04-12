const UserModel=require("../models/UserModel")
const s3link=require("../cloud link/s3link");

const jwt=require('jsonwebtoken')
const mongoose=require('mongoose')

const bcrypt = require('bcrypt');
const saltRounds = 10;

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId);
  };

  const isvalidStringOnly = function (value) {
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };
const isValid = function (value) {
    if (typeof value === "undefined" || typeof value == "null") {
      return false;
    }
  
    if (typeof value === "string" && value.trim().length > 0) {
      return true;
    }

    if (typeof value === ("object") && Object.keys(value).length > 0) {
        return true;
      }
  };
  
  isvalidRequesbody = function (requestbody) {
    if (Object.keys(requestbody).length > 0) {
      return true;
    }
  };

  

  

  const registerUser= async function(req,res){
try{
    
        const data = req.body
        let {fname,lname,email,password,phone,address,} =data
        let files=req.files

        if (!isvalidRequesbody(data)) {
            return res.status(400).send({ status: false, msg: "please provide Data" })
        }
        
        if (!isValid(fname)) {
            return res.status(400).send({ status: false, msg: "fname required" })
        }
        if (!isValid(lname)) {
            return res.status(400).send({ status: false, msg: "lname required" })
        }
        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: "email required" })
        }
        if (!isValid(password)) {
            return res.status(400).send({ status: false, msg: "password required" })
        }
        if (!isValid(phone)) {
            return res.status(400).send({ status: false, msg: "phone required" })
        }
        if (!isValid(address)) {
            return res.status(400).send({ status: false, msg: "address required" })
        }

        if(!isValid(address.shipping.street)){return res.status(400).send({status:false,msg:"please give shipping street"})}

        if(!isValid(address.shipping.city)){return res.status(400).send({status:false,msg:"please give shipping city"})}

        if(!isValid(address.shipping.pincode)){return res.status(400).send({status:false,msg:"please give shipping pincode"})}

        if(!isValid(address.billing.street)){return res.status(400).send({status:false,msg:"please give billing street"})}

        if(!isValid(address.billing.city)){return res.status(400).send({status:false,msg:"please give shipping street"})}

        if(!isValid(address.billing.pincode)){return res.status(400).send({status:false,msg:"please give billing pincode"})}

          
        // if (!isValid(profileImage)) {
        //     return res.status(400).send({ status: false, ERROR: "profileimage required" })
        // }

        if (!(password.trim().length >= 8 && password.trim().length <= 15)) {
            return res.status(400).send({ status: false, message: "Please provide password with minimum 8 and maximum 14 characters" });;
        }
        profileImage = await s3link.uploadFile(files[0])
        
        const DuplicateEmail = await UserModel.findOne({ email });
        if (DuplicateEmail) {
            return res.status(400).send({ status: false, message: "This email Id already exists with another user" });
        }

        if (!/^([+]\d{2})?\d{10}$/.test(phone)) {
            return res
              .status(400)
              .send({ status: false, msg: "please provide a valid phone Number" });
          }

          const duplicatePhone = await UserModel.findOne({ phone })
        if (duplicatePhone) {
            return res.status(400).send({ status: false, message: "This phone number already exists with another user" });
        }

          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res
              .status(400)
              .send({ status: false, msg: `Invalid email address!` });
          }      
        


    

        let hash = bcrypt.hashSync(password, saltRounds);
        console.log(password)

        const userData = {
            fname,
            lname,
            profileImage,
            email,
            password:hash,
            phone,
            address

        }

        const savedUser = await UserModel.create(userData);
        res.status(201).send({status:true,message:'User Registered',data:savedUser});





    }
catch(err){res.status(500).send({Status:false,error:err.message})}}

  
//   =================================================================================================================================================
const login = async function (req, res) {

    try {
        const data = req.body
        const { email, password } = data
        let query = req.query
        if (isValidRequestBody(query)) {
            return res.status(400).send({ status: false, message: 'this is not allowed' })
        }

        if (!data) {
            return res.status(400).send({ status: false, message: "please input Some Data" })
        }

        if (!isValid(email)) {
            return res.status(401).send({ status: false, message: "please input valid emailId" })
        }

        if (!isValid(password)) {
            return res.status(401).send({ status: false, message: "please input valid password" })
        }

        const user = await UserModel.findOne({ email:email})
        if (user) {
            const decryptedPassword = await bcrypt.compareSync(data.password, user.password);
            console.log(decryptedPassword)
        
        if(decryptedPassword){
            const userID = user._id
        const payLoad = { userId: userID }
        const secretKey = "group2project3almostdone"

        // creating JWT

        const token = jwt.sign(payLoad, secretKey, { expiresIn: "1hr" })

        res.setHeader("Authorization","Bearer"+token)


        return res.status(201).send({ status: true, message: "login successful", data: {userId: user._id,token} })

        }else {
            res.status(401).send({ error: "Password is not correct" });
        }

    }else {
        return res.status(400).send({ status: false, message: "mail id is not valid" });
    }
        

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
// =================================================================================================================================
const getUser=async function(req,res){
try{
    let userId=req.params.userId
    if(!isValidObjectId(userId)){return res.status(400).send({status:false,msg:"invalid userId format"})}
let getUser=await UserModel.findById(userId)
if(!getUser){return res.status(404).send({status:false,msg:"no user with this Id found"})}
res.status(200).send({status:true,msg:"sucess",data:getUser})



}

catch(err){res.status(500).send({status:false,error:err.message})}

}
// ==============================================================================================================================================================

const updateUser=async function(req,res){
    try{

        let userId=req.params.userId
        if(!isValidObjectId(userId)){return res.status(400).send({status:false,msg:"invalid userId format"})}
        let checkUserId=await UserModel.findById(userId)
        if(!checkUserId){return res.status(404).send({status:false,msg:"userId not found"})}

        let data=req.body
        if(!isvalidRequesbody(data)){return res.status(400).send({status:false,msg:"please give some data to update"})}
        let {fname,lname,email,password,phone,address,} =data

       

if(!isvalidStringOnly(fname)){return res.status(400).send({status:false,msg:"please give fname"})}
if(!isvalidStringOnly(lname)){return res.status(400).send({status:false,msg:"please give lname"})}
       

       
           if(!isvalidStringOnly(password)){return res.status(400).send({status:false,msg:"please give password"})}

       

    
        //    if(!isvalidStringOnly(profileImage)){return res.status(400).send({status:false,msg:"please provide image"})}
       

    if(!isvalidStringOnly(email)){return res.status(400).send({status:false,msg:"please give emaill"})}
    if(email){
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res
          .status(400)
          .send({ status: false, msg: `Invalid email address!` });
      }      

      let checkDuplicateemail=await UserModel.findOne({email})
      if(checkDuplicateemail){return res.status(400).send({status:false,msg:"this email is already registred"})}}



    if(!isvalidStringOnly(phone)){return res.status(400).send({status:false,msg:"please provide phone number"})}
if(phone){
        if (!/^([+]\d{2})?\d{10}$/.test(phone)) {
            return res
              .status(400)
              .send({ status: false, msg: "please provide a valid phone Number" });
          }

          const duplicatePhone = await UserModel.findOne({ phone })
        if (duplicatePhone) {
            return res.status(400).send({ status: false, message: "This phone number already exists with another user" });
        }
}

let files=req.files
let profileImage

if(files.length>0){
 profileImage = await s3link.uploadFile(files[0])}

let hash
if(password){
  hash = bcrypt.hashSync(password, saltRounds);}

const userData = {
    fname,
    lname,
    profileImage,
    email,
    password:hash,
    phone,
    address

}


if(!isvalidStringOnly(address)){return res.status(400).send({status:false,msg:"please provide address"})}
let updateUser=await UserModel.findOneAndUpdate({userId},userData,{new:true})
res.status(200).send({status:true,msg:"updated sucessfully",data:updateUser})

    }
    catch(err){res.status(500).send({status:false,error:err.message})}
}





  module.exports.registerUser=registerUser
  module.exports.login=login
  module.exports.getUser=getUser
  module.exports.updateUser=updateUser