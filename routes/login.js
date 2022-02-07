"use strict"

const express = require("express");
const router = express.Router();
const mdlUser = require("../models/mdlUsers");
require("dotenv").config();

router.get("/", (req, res) => {
    if (req.session.user) {
        const user = req.session.user
    res.render("products", {user});
    }
    else {
        res.render("login");
    }
});

router.get("/logout", (req,res) => {
    req.session.destroy();
    res.redirect("/");
});

router.post("/", async (req, res) => {
    const { user, pass } = req.body;
 
    const data = await mdlUser.getUser(user, pass);
    if(data != undefined) {
        req.session.user = user
        res.render("products", {user});
    } else {
        const message = "Usuario o Contraseña incorrectos"
        res.render("login", {message});
    }
});



module.exports = router;