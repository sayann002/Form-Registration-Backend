const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
require("./src/db/connection");
const path = require("path");
const hbs = require("hbs");
const Register = require("./src/models/registers");
const { json } = require("express");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
// SET STATIC FOLDER
//app.use(express.static(path.join(__dirname, "public")));
const template_path = path.join(__dirname, "./templates/views");
const partial_path = path.join(__dirname, "./templates/partials");

app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path);

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/register", (req, res) => {
  res.render("register");
});

// CREATE A NEW USER IN THE DATABASE
app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    if (password === cpassword) {
      const registerUser = new Register({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        age: req.body.age,
        gender: req.body.gender,
        password: password,
        confirmpassword: cpassword,
      });
      const savedUser = await registerUser.save();
      res.status(201).render("index");
    } else {
      res.send("Password is not matching.");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
