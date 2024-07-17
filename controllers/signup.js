const { body, validationResult } = require("express-validator");
const UsersLogin = require("../models/Login");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

exports.signup = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isEmail()
    .withMessage("Username must be a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter"),

  async (req, res) => {
    const locals = {
      title: "Sign Up Page",
      description: "Sign Up Description",
    };

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signup", {
        ...locals,
        errors: errors.array(),
        values: req.body,
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const data = {
        name: req.body.username,
        password: hashedPassword,
      };

      const userData = await UsersLogin.create(data);

      const token = jwt.sign(
        { id: userData._id, name: userData.name },
        JWT_SECRET,
        { expiresIn: "1h" },
      );

      res.cookie("token", token, { httpOnly: true });
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
      res.status(500).render("signup", {
        ...locals,
        error: "Something went wrong. Please try again.",
      });
    }
  },
];

exports.signupForm = (req, res) => {
  const locals = {
    title: "Sign Up Page",
    description: "Sign Up Description",
  };
  res.render("signup", { ...locals, errors: [], values: {} });
};
