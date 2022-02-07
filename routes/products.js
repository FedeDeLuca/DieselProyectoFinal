"use strict"

const express = require("express");
const router = express.Router();

router.get("/",  async (req, res) => {
    res.render("products", {user: req.session.user},);
});

module.exports = router;