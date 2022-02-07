const express = require("express");
const session = require("express-session");
const path = require("path");
const hbs = require("hbs");
const fileupload = require("express-fileupload");
const port = 3000;
require("dotenv").config();

const routerLogin = require("./routes/login");
const routerIndex = require("./routes/index");
const routerDone = require("./routes/done");
const routerProducts = require("./routes/products");
const routerEmail = require("./routes/email");
const routerAddItem = require("./routes/editor");
const routerCrud = require ("./routes/crud")


const app = express();

app.use(
    fileupload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
  );
  

app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true
    })
);

const secured = async (req, res, next) => {
    if(req.session.user){
        next();
    } else {
        const message = "Debe ser usuario para utilizar esta seccion, en el caso de serlo iniciar secion"
        res.render("login", {message});
    }
};

const login = (req, res, next) => {
    app.locals.loggeduser = req.session.user;
    next();
};



app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "hbs");

hbs.registerPartials(path.join(__dirname, "./views/partials"));

app.use("/", login, routerIndex);
app.use("/login", routerLogin);
app.use("/email", routerEmail);
app.use("/products", secured, routerProducts);
app.use("/crud", secured, routerCrud);
app.use("/additem", secured, routerAddItem);
app.use("/done", routerDone);

app.listen(port, (err) => {
    err? console.log("Server error")
    : console.log(`Server running in http://localhost:${port}/`)
});