//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')


const app = express();
const saltRounds = 10;
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
            bcrypt.compare(password,founduser.password,function(err,result){
                if(result === true){
                  res.render("secrets");
                }
            });
            
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
   
   bcrypt.hash(req.body.password,saltRounds,(err,hash)=>{
    const new_user = new User({
        email:req.body.username,
        password:hash
   });

   new_user.save(function(err){
    if(!err){
      console.log("New User Added");
      res.render("secrets");
    }
   });
   
   });
})
app.listen(3000, function() {
  console.log("Server started on port 3000");
});