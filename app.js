//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption')

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
   email:String,
   password:String
})


// const secret = "Thisisourlittlesecret.";

userSchema.plugin(encrypt, {secret:process.env.SECRET,encryptedFields:['password']});

const User = new mongoose.model("user",userSchema);
app.get('/', (req, res) => {
  res.render('home')
})
app.route("/login")

.get((req, res) => {
  res.render('login')
})

.post(function(req,res){
    const email = req.body.username;
    const password = req.body.password;

    User.findOne({email:email},(err,founduser)=>{
       if(!err){
        if(founduser){
           if(founduser.password === password){
              console.log("Succesfully Loged in");
              res.render("secrets");
           }
        }
       }
       else{
        console.log(err);
       }
    })
})
app.route("/register")

.get(function(req,res){
   res.render("register")
})

.post(function(req,res){
   const email = req.body.username;
   const pass = req.body.password;

   const new_user = new User({
        email:email,
        password:pass
   });

   new_user.save(function(err){
    if(!err){
      console.log("New User Added");
      res.render("secrets");
    }
   });
})
app.listen(3000, function() {
  console.log("Server started on port 3000");
});