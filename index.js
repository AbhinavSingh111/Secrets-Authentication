import dotenv from "dotenv";
import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";

// importing requirements for cookies and sessions using passport for mongobd

import session from "express-session";
import passport from "passport";
import passportLocalMongoose from 'passport-local-mongoose';


const app = express();
const port = 3000;
dotenv.config();
const secret = process.env.SECRET

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


// creating express-session session
app.use(session({
    secret : secret,
    resave : false,
    saveUninitialized : false
}))

// initializing passport

app.use(passport.initialize());

// set session using passport
app.use(passport.session());

// creating mongoose connection

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



// modifying above schema to use encryption

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});


// using passportLocalMongoose plugin for salting hashing and saving data to db

userSchema.plugin(passportLocalMongoose);


const User = new mongoose.model("User", userSchema);

// creating user strategy and serialization and deserialization for sessions

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get('/secrets' , (req,res)=>{
    if(req.isAuthenticated()){
        res.render('secrets.ejs');
    }
    else{
        res.redirect('/login');
    }
});

app.get('/logout',(req,res)=>{
    req.logout((err)=>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/');
        }
    });
    
});

app.post("/login", (req, res) => {
    const user = new User ({
        username : req.body.username,
        password : req.body.password
    })
    req.login(user,function(err){
        if(err){
            console.log(err);
        }
        else{
            passport.authenticate('local')(req,res,function(){
                res.redirect('/secrets');
            });
        }
    })
  
  
 
});

app.post("/register",  (req, res) => {
    User.register({username : req.body.username}, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect('/register');
        }
        else{
            passport.authenticate('local')(req,res,function(){
                res.redirect('/secrets');
            });
        }
    });
    
});


app.listen(port, (req, res) => {
  console.log(`listening on port ${port}`);
});
