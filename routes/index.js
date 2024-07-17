const express = require("express");
const router = express.Router();

const homeController = require("../controllers/home");
const loginController = require("../controllers/login");
const signupController = require("../controllers/signup");
const logoutController = require("../controllers/logout");

router.get("/", homeController.homepage);
router.get("/login", loginController.login);
router.post("/login", loginController.authenticate);
router.get("/signup", signupController.signupForm);
router.post("/signup", signupController.signup); //
router.get("/dashboard", (req, res) => {
  res.render("dashboard", { title: "Dashboard", user: req.user });
});
router.get("/logout", logoutController.logout);

module.exports = router;
