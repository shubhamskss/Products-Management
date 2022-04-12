const express = require('express');
const router = express.Router();
const UserController=require("../controllers/UserController")
// const profilepic=require("../cloud link/s3link")

// router.post("/profile",profilepic.createAws)

router.post("/register",UserController.registerUser)
router.post("/login",UserController.login)
router.get("/user/:userId/profile",UserController.getUser)
router.put("/user/:userId/profile",UserController.updateUser)




module.exports=router;