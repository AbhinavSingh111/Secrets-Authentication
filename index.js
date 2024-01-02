import dotenv from "dotenv";
import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";

// importing requirements for cookies and sessions using passport for mongobd

import session from "express-session";
import passport from "passport";
import passportLocalMongoose from 'passport-local-mongoose';

// FOR GOOGLE OAUTH20 
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// to make findOrCreate call back work
import findOrCreate from "mongoose-findorcreate";




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
  googleId: String,
  secret: String
});


// using passportLocalMongoose plugin for salting hashing and saving data to db

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);


const User = new mongoose.model("User", userSchema);

// creating user strategy and serialization and deserialization for sessions

passport.use(User.createStrategy());

// for local strategy (user, password)
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// for all strategies
passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });


// settingup google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get('/secrets' , async (req,res)=>{
    const foundUsers = await User.find({'secret':{'$ne':null}});
    if(foundUsers){
        if(req.isAuthenticated()){
            res.render('secrets.ejs',{usersWithSecrets:foundUsers,loggedIn:true});
        }
        else{
            res.render('secrets.ejs',{usersWithSecrets:foundUsers,loggedIn:false});
        }
    }
    
    else{
        console.log("Some error occured in fetching users with secrets!");
    }
    
});


app.get('/submit',(req,res)=>{
    if(req.isAuthenticated()){
        res.render('submit.ejs');
    }
    else{
        res.redirect('/login');
    }
})

app.post('/submit', async (req,res)=>{
    const submittedSecret = req.body.secret;
    const foundUser = await User.findById(req.user.id);
    if(foundUser){
        foundUser.secret = submittedSecret;
            await foundUser.save();
            res.redirect('/secrets');
    }
    else
    {
        console.log(err);
        res.render('/secrets');
    }
       
})

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

  app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
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

app.post("/register", async (req, res) => {
    // Check if a user with the same username already exists
        const foundUser = await User.findOne({ username: req.body.username });
        // If a user with the same username exists, redirect to the registration page with an error message
        if (foundUser) {
            console.log('User with this username already exists.');
            return res.redirect('/register');
        }

        // If the username is unique, proceed with user registration
        User.register({ username: req.body.username }, req.body.password, (err, user) => {
            if (err) {
                console.error(err);
                return res.redirect('/register');
            }

            // If registration is successful, authenticate the user and redirect to the secrets page
            passport.authenticate('local')(req, res, () => {
                res.redirect('/secrets');
            });
        });
    });




app.listen(port, (req, res) => {
  console.log(`listening on port ${port}`);
});
