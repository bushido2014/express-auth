const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const expressLayout = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authMiddleware = require("./middleware/auth");

const app = express();
const port = 3010;

// Connect to Database
connectDB();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(authMiddleware);

//Template Engine
app.use(expressLayout);
app.set("layout", "layouts/main");
app.set("view engine", "ejs");

// Routes
app.use("/", require("./routes/index.js"));

// Handle 404
app.get("*", (req, res) => {
  res.status(404).render("404");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
