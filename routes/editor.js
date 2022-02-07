"use stric"

const express = require("express");
const { body, validationResult } = require("express-validator");
const cloudinary = require("cloudinary").v2;
const util = require("util");
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);
const router = express.Router();
const mdlArt = require("../models/mdlArt")

router.get("/", (req, res) => {
    res.render("addItem");
});

const validationRules = [
    body("name", "Debe ingresar un nombre").exists().isLength({ min:2}),
    body("origin", "Debe ingresar un origen").exists().isLength({ min:2}),
    body("price", "Debe ingresar un valor numerico").exists(). isNumeric(),
]

router.post("/", validationRules, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formData = req.body;
        const arrWarning = errors.array();
        res.render("addItem", { formData, arrWarning});
    } else{
        if(!req.files){
            const messageImg = "Debe cargar una imagen"
            res.render("additem", {messageImg})
        }else{
    let imgFile = req.files.image;
    const img_id = (await uploader(imgFile.tempFilePath)).public_id;

    await mdlArt.addProduct({...req.body, img: img_id});
    res.redirect("/crud");
    }}
});

router.get("/handleEdit/:id", async (req, res) => {
    const row = await mdlArt.getProduct(req.params.id)
    const product = {
        id: row[0].id,
        name: row[0].name,
        mark: row[0].mark,
        model: row[0].model,
        Description: row[0].Description,
        price: row[0].price,
        img: row[0].img,
    };
    res.render("editItem", {product});
});

router.post("/handleEdit/editProduct", validationRules, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formData = req.body;
        const arrWarning = errors.array();
        res.render("editItem", { formData, arrWarning});
    }else{
    let img_id = null;
    if(!req.files){
        img_id = req.body.prevImage;
    } else{
        const row = await mdlArt.getProduct(req.body.id);
        await destroy(row[0].img);
        const imageFile = req.files.imageFile;
        img_id = (await uploader(imageFile.tempFilePath)).public_id;
      }
    const data = {
        id: req.body.id,
        name: req.body.name,
        origin: req.body.origin,
        price: req.body.price,
        img: img_id,
    }
    await mdlArt.modifyProduct(data, data.id);
    res.redirect("/crud");}
});

router.get("/handleEdit/deleteProduct/:id", async (req, res) => {
    const row = await mdlArt.getProduct(req.params.id);
    await destroy(row[0].img);
    await mdlArt.deleteProduct(req.params.id);
    res.redirect("/crud");
});


module.exports = router; 