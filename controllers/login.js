const { body, validationResult } = require("express-validator");
const UsersLogin = require("../models/Login");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET;

exports.login = (req, res) => {
  const locals = {
    title: "Login Page",
    description: "Login Description",
    errors: [],
  };
  res.render("login", locals);
};

exports.authenticate = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  async (req, res) => {
    const { username, password } = req.body;
    const locals = {
      title: "Login Page",
      description: "Login Description",
    };

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("login", {
        ...locals,
        errors: errors.array(),
      });
    }

    try {
      const user = await UsersLogin.findOne({ name: username });
      if (!user) {
        return res.status(400).render("login", {
          ...locals,
          errors: [{ msg: "Invalid username or password. Please try again." }],
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).render("login", {
          ...locals,
          errors: [{ msg: "Incorrect password. Please try again." }],
        });
      }

      const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.cookie("token", token, { httpOnly: true });
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
      res.status(500).render("login", {
        ...locals,
        errors: [{ msg: "Something went wrong. Please try again." }],
      });
    }
  },
];
