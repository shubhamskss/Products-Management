const express = require('express');
const router = express.Router();
const UserController=require("../controllers/UserController")
const ProductController=require("../controllers/productController")
const mid=require("../middleware/mid")
const cartContrl=require("../controllers/cartController")
const checkOut=require("../controllers/orderController")
// const profilepic=require("../cloud link/s3link")

// router.post("/profile",profilepic.createAws)

router.post("/register",UserController.registerUser)
router.post("/login",UserController.login)
router.get("/user/:userId/profile",mid.authenticate,mid.authorise,UserController.getUser)
router.put("/user/:userId/profile",mid.authenticate,mid.authorise,UserController.updateUser)

router.post("/products",ProductController.saveProducts)
router.get("/products",ProductController.getProducts)
router.get("/products/:productId",ProductController.getProductById)
router.put("/products/:productId",ProductController.updateProduct)
router.delete("/products/:productId",ProductController.deleteByid)

router.post("/users/:userId/cart",mid.authenticate,mid.authorise,cartContrl.cart)
router.put("/users/:userId/cart",mid.authenticate,mid.authorise,cartContrl.updatecart)

router.get("/users/:userId/cart",mid.authenticate,mid.authorise,cartContrl.getCart)
router.delete("/users/:userId/cart",mid.authenticate,mid.authorise,cartContrl.deleteCart)

router.post("/users/:userId/orders",mid.authenticate,mid.authorise,checkOut.order)
router.put("/users/:userId/orders",mid.authenticate,mid.authorise,checkOut.updateOrder)
module.exports=router;