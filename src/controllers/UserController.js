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

        if (!(isvalidRequesbody(data)||(files))) {
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
        if (!/^([+]\d{2})?\d{6}$/.test(address.shipping.pincode.trim())) {
            return res.status(400).send({ status: false, message: 'Shipping PinCode not valid, please provide 6 Digit valid pinCode' });
        }

    
        if(!isValid(address.billing.street)){return res.status(400).send({status:false,msg:"please give billing street"})}

        if(!isValid(address.billing.city)){return res.status(400).send({status:false,msg:"please give billing pincode"})}
        

        if(!isValid(address.billing.pincode)){return res.status(400).send({status:false,msg:"please give billing pincode"})}
        if (!/^([+]\d{2})?\d{6}$/.test(address.billing.pincode.trim())) {
            return res.status(400).send({ status: false, message: 'Billing PinCode not valid, please provide 6 Digit valid pinCode' });
        }

    
        

        if (!(password.trim().length >= 8 && password.trim().length <= 15)) {
            return res.status(400).send({ status: false, message: "Please provide password with minimum 8 and maximum 14 characters" });;
        }

        if(!files.length>0){return res.status(400).send({status:false,msg:"please give file"})}

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
        if (isvalidRequesbody(query)) {
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

        const userId = req.params.userId
      
      if (!isValidObjectId(userId)) {
          return res.status(400).send({ status: false, msg: "userId is invalid" })
      }
      checkuser=await UserModel.findById(userId)
      if(!checkuser){return res.status(404).send({status:true,msg:"user with this id not found"})}
      let { fname, lname, email, phone, password, address } = req.body
      let file = req.files
      const dataObject = {};
      if (!(isvalidRequesbody(req.body)||(file))) {
          return res.status(400).send({ status: false, msg: "enter data to update" })
      }
      if (isValid(fname)) {
          dataObject['fname'] =fname
      }
      if (isValid(lname)) {
          dataObject['lname'] = lname
      }
      if (isValid(email)) {
          let findMail = await UserModel.findOne({ email: email })
          if (findMail) {
              return res.status(400).send({ status: false, msg: "this email is already register" })
          }
          dataObject['email'] = email
      }
      if (isValid(phone)) {
          let findPhone = await UserModel.findOne({ phone: phone })
          if (findPhone) {
              return res.status(400).send({ status: false, msg: "this mobile number is already register" })
          }
          dataObject['phone'] = phone
      }
      if (isValid(password)) {
          if (!password.length >= 8 && password.length <= 15) {
              return res.status(400).send({ status: false, msg: "password length should be 8 to 15" })
          }
          let saltRound = 10
          const hash = await bcrypt.hash(password, saltRound)
          dataObject['password'] = hash
      }
     
      if (file.length > 0) {
          let uploadFileUrl = await s3link.uploadFile(file[0])
          dataObject['profileImage'] = uploadFileUrl
      }

      if (address) {
          
          if (address.shipping) {
              if (address.shipping.street) {

                  dataObject['address.shipping.street'] = address.shipping.street
              }
              if (address.shipping.city) {

                  dataObject['address.shipping.city'] = address.shipping.city
              }
              if (address.shipping.pincode) {
                  
                  if(!/(^[0-9]{6}(?:\s*,\s*[0-9]{6})*$)/.test(address.shipping.pincode)){
                   return res.status(400).send({status:false, msg:`pincode six digit number`})
                  }
                 
                  dataObject['address.shipping.pincode'] = address.shipping.pincode
                  
              }
              
          }

          if (address.billing) {
              if (address.billing.street) {

                  dataObject['address.billing.street'] = address.billing.street
              }
              if (address.billing.city) {

                  dataObject['address.billing.city'] = address.billing.city
              }
              if (address.billing.pincode) {
                 
                  if(!/(^[0-9]{6}(?:\s*,\s*[0-9]{6})*$)/.test(address.billing.pincode)){
                    return res.status(400).send({status:false, msg:`pincode six digit number`})
                   }
                  dataObject['address.billing.pincode'] = address.billing.pincode
              }
          }
      }
      const updateProfile = await UserModel.findOneAndUpdate({_id:userId }, dataObject , { new: true })
      if (!updateProfile) {
          return res.status(404).send({ status: false, msg: "user profile not found" })
      }
      return res.status(200).send({ status: true, msg: "User Profile updated", data: updateProfile })

  }
    catch(err){res.status(500).send({status:false,error:err.message})}
}





  module.exports.registerUser=registerUser
  module.exports.login=login
  module.exports.getUser=getUser
  module.exports.updateUser=updateUser