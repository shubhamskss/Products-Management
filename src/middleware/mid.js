const jwt=require('jsonwebtoken')
let mongoose=require('mongoose')
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId);
  };

const authenticate = async function(req, res, next){
    try{
        const token = req.header('Authorization',"Bearer Token");
        
        if(!token){
        return res.status(400).send({status: false, message : "Please provide token"})
        }
        let tokendata = token.split(" ");

        const decodedToken = jwt.verify(tokendata[1], "group2project3almostdone") 

        if(!decodedToken){
        return res.status(401).send({status : false, message: "authentication failed"})
        }
        // setting a key in request,  "decodedToken" which consist userId and exp.
        req.decodedToken = decodedToken
        
        next()

    }catch(err){
       
        res.status(500).send({error : err.message})
    }
}
// ===================================================================================================
let authorise = async function (req, res, next) {
  try {
    let userID = req.params.userId;
    
    if (!userID) {
      return res
        .status(400)
        .send({ status: false, msg: "userID is required for authorisation" });
    }
    if(!isValidObjectId(userID)){return res.status(400).send({status:false,msg:"invalid USERID"})}
    let token=req.header("Authorization","Bearer Token")
    let tokenData=token.split(" ")
    let decodetoken = jwt.verify(tokenData[1], "group2project3almostdone");
    if (!decodetoken) {
      return res
        .status(401)
        .send({ status: false, msg: "you are not authenticated" });
    }

    

    let userloggedin = decodetoken.userId;
    usertobeModified=userID
    
    if(!userloggedin){return res.status(400).send({status:false,msg:"bad request"})}
    
    if (usertobeModified != userloggedin) {
      return res
        .status(403)
        .send({ status: false, msg: "you are not authorised" });
      
    }
    next()
  
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

module.exports.authenticate = authenticate;
module.exports.authorise = authorise;
