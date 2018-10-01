const User = require('../models/user');
const {check, validationResult} = require('express-validator/check');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {
  
  router.post('/register',
  [check('email').isEmail(),check('password').isLength({ min: 4 }),check('username').isLength({ min: 4 })],
   (req,res)=>{
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(" Errors are - "+errors);
      return res.status(422).json({ errors: errors.array() });
    } else {
      let user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      });
      user.save((err)=>{
        if(err){
          console.log("In Here");
          res.json({success:false, message:"Could not save User ",err});
        }else{
          res.json({success:true,message:"User Saved! "});
        }
      });
    }
  });

  router.get('/checkEmail/:email',(req,res)=>{
    if(!req.params.email){
      res.json({success:false , message: 'Email is already taken Baby! :* '});
    }else{
      User.findOne({email: req.params.email},(err,user)=>{
        if(err){
          res.json({success:false , message: err});
        }else{
          if(user){
            res.json({success:false, message: 'Email is already taken'});
          }else{
            res.json({success:true, message: 'Email is available Baby'});
          }
        }
      })
    }
  });

  router.get('/checkUsername/:username',(req,res)=>{
    if(!req.params.username){
      res.json({success:false , message: 'Username is already taken Baby! :* '});
    }else{
      User.findOne({username: req.params.username},(err,user)=>{
        if(err){
          res.json({success:false , message: err});
        }else{
          if(user){
            res.json({success:false, message: 'Username is already taken'});
          }else{
            res.json({success:true, message: 'Username is available Baby'});
          }
        }
      })
    }
  });

  router.post('/login',(req,res)=>{
    if(!req.body.username){
      res.json({success: false, message:"Please provide a Username"});
    }else{
      if(!req.body.password){
        res.json({success:false, message:"Please provide a Password"});
      }else{
        User.findOne({username:req.body.username.toLowerCase() }, (err,user)=> {
          if(err){
            res.json({success: false , message: err})
          }
          if(!user){
            res.json({success: false, message:"Username not found"});
          }else{
            const validPass = user.comparePassword(req.body.password);
            if(!validPass){
              res.json({success:false, message:"Password is not correct"});
            }else{
              //Successful Login
              const token = jwt.sign({userId: user._id},config.secret, {expiresIn: '24h'});
              res.json({success:true, message:" Success", token: token, user: {username : user.username}});
            }
          }

        })
      }
    }
  });
  // MIDDLEWARE! AFTER THIS< ONLY AUTHENTIC PERSON
  router.use((req,res,next)=>{
    const token = req.headers['authorization'];
    if(!token){
      res.json({success: false, message: "No Token Provided"});
    }else{
      jwt.verify(token,config.secret,(err,decoded)=>{
        if(err){
          res.json({success:false , message:"Invalid Token"});
        }else{
          req.decoded = decoded;
          next();
        }
      })
    }
  });

  router.get('/profile',(req,res)=> {
    // res.send(req.decoded);
    User.findOne({_id:req.decoded.userId}).select('username email').exec((err,user)=>{
      if(err){
        res.json({success:false, message:err});
      }else{
        if(!user){
          res.json({success:false, message:"User not found"});
        }else{
          res.json({success:true, user:user});
        }
      }
    });
    });


  return router;
}
