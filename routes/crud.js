"use strict"

const express = require("express");
const cloudinary = require("cloudinary").v2;
const router = express.Router();
const mdlArt = require("../models/mdlArt")

router.get("/",  async (req, res) => {
    const data = await mdlArt.getProducts();
    const products = data.map((row) => {
        const imgUrl = cloudinary.url(row.img,
        {
            width: 100,
            height: 100,
            crop:"fill",
        });
        return {...row, imgUrl}
    });
    res.render("crud", { products });
});


module.exports = router;