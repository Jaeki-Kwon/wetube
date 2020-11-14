import express from "express";

const app = express();

const handleHome = (req, res) => res.send("Home");
const handleAboutUs = (req, res) => res.send("About");
const handleContact = (req, res) => res.send("Contact");
const handleProtected = (req, res) => res.send("Can't come in");

const consoleMiddleware = (req, res, next) => {
  console.log("I'm a middleware");
  next();
};

const redirectMiddleware = (req, res) => {
  console.log("되고있나??");
  res.redirect("/");
};

app.use(consoleMiddleware);

app.get("/", handleHome);
app.get("/about-us", handleAboutUs);
app.get("/contact", handleContact);
app.get("/protected", redirectMiddleware, handleProtected);
// Codesanbox does not need PORT :)
app.listen(() => console.log(`Listening!`));
