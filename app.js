import dotenv from "dotenv";
import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";

// for encryption
import encrypt from "mongoose-encryption";

// for hashing
import md5 from "md5";

// for using salting and bcrypt

import bcrypt from "bcrypt";

// defining round of salting
const saltRounds = 10;

const app = express();
const port = 3000;
dotenv.config();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// creating mongoose connection

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// creating schema (normal)
// const userSchema = {
//   email: String,
//   password: String,
// };

// modifying above schema to use encryption

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// defining a secert key for encryption (use it as a environment variable)

// using encryption plugin on schema and defining fields to encrypt
// const secret = process.env.SECRET
// const secret = process.env.SECRET

// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  //   const password = md5(req.body.password);
  const password = req.body.password;

  try {
    const foundUser = await User.findOne({ email: username });
    if (foundUser) {
      bcrypt.compare(password, foundUser.password, function (err, result) {
        if (result === true) {
          res.render("secrets.ejs");
        } else {
          res.redirect("/login");
        }
      });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});

app.post("/register", async (req, res) => {
    try {
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        // Create a new user with the hashed password
        const newUser = new User({
            email: req.body.username,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();
        
        // Redirect to a success page or render a success view
        res.render("secrets.ejs");
    } catch (err) {
        // Handle errors
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
  });


app.listen(port, (req, res) => {
  console.log(`listening on port ${port}`);
});
