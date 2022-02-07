"use strict"

const express = require("express");
const cloudinary = require("cloudinary").v2;
const router = express.Router();
const mdlArt = require("../models/mdlArt")

router.get("/",  async (req, res) => {
    const data = await mdlArt.getProducts();
    const products = data.map((row) => {
        const imgUrl = cloudinary.url(row.img,
);
        return {...row, imgUrl}
    });
    res.render("done", { products });
});

module.exports = router;