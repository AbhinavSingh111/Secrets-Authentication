import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";

// for encryption
import encrypt from "mongoose-encryption";

const app = express();
const port = 3000;

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

const secret = "Greetings , fellow coder ! Let's have a chat.";

// using encryption plugin on schema and defining fields to encrypt

userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

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
  const password = req.body.password;

  try {
    const foundUser = await User.findOne({ email: username });
    console.log(foundUser);

    if (foundUser) {
      if (password === foundUser.password) {
        res.render("secrets.ejs");
      } else {
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});

app.post("/register", async (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });

  try {
    await newUser.save();
    res.render("secrets.ejs");
  } catch (err) {
    console.error(err);
  }
});

app.listen(port, (req, res) => {
  console.log(`listening on port ${port}`);
});
