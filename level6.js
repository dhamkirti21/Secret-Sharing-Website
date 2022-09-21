//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const session = require('express-session')
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");
const e = require('express');



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


app.use(session({
    secret:"thisisacrowsoup!",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
   email:String,
   password:String,
   googleId:String,
   secret:String
})

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
// const secret = "Thisisourlittlesecret.";

const User = new mongoose.model("user",userSchema);

passport.use(User.createStrategy());
passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        id: user.id,
        username: user.username,
        picture: user.picture
      });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });
passport.use(new GoogleStrategy({
    clientID:process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
app.get('/', (req, res) => {
  res.render('home')
})

app.route("/login")

.get((req, res) => {
  res.render('login')
})

.post(function(req,res){
    const user = new User({
      username:req.body.username,
      password:req.body.password
    });
    req.login(user,function(err){
      if(err){
        console.log(err);
      }
      else{
        passport.authenticate("local");
        res.redirect("/secrets");
      }
    })
});

app.get("/secrets",function(req,res){
    User.find({"secret":{$ne:null}},function(err,founduser){
      if(!err){
        res.render("secrets",{userswithSecrets:founduser});
      }
      else{
        console.log(err);
      }
    })
});

app.get("/logout", function(req,res){
  req.logout((err)=>{
    if(err){
      console.log(err);
    }
  });
  res.redirect("/");
});

app.route("/register")

.get(function(req,res){
   res.render("register")
})

.post(function(req,res){
   User.register({username:req.body.username},req.body.password,(err,user)=>{
     if(err){
      console.log(err);
      res.redirect("/register");
     }
     else{
        passport.authenticate("local")(req,res,function(){
          res.redirect("/secrets");
        })
     }
   })
  
});

app.get('/auth/google',passport.authenticate("google",{scope:['profile']}));
app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/secrets');
  });


app.route("/submit")
.get(function(req,res){
    if(req.isAuthenticated()){
      res.render("submit");
    }
    else{
      res.redirect("/login");
    }
})

.post(function(req,res){
    const submitted = req.body.secret;
    
    User.findById(req.user.id,function(err,foundUser){
        if(err){
          console.log(err);
        }
        else{
          if(foundUser){
            foundUser.secret = submitted;
            foundUser.save(function(){
              res.redirect("/secrets");
            })
          }
        }
    })


});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});