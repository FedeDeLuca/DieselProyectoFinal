"use strict"

const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const nodemailer = require("nodemailer");

router.get("/", (req, res) => {
    res.render("email");
});

router.post("/", 
    [
        body("name", "Debe ingresar un nombre")
        .exists()
        .isLength({min:2}),
        body("email", "Debe ingresar un email válido")
        .exists()
        .isEmail(),
        body("message", "Debe ingresar un mensaje")
        .exists()
        .isLength({min:2, max:50})
    ],

    async (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const formData = req.body;
        const arrWarning = errors.array();

        res.render("email", {formData, arrWarning});
    } else{

    
        
    const emailMessage = {
        to: "contacto@dieselmeni.com",
        from: req.body.email,
        subject: "Mensaje enviado a través de formulario web",
        html: `${req.body.name}
        Envio el siguiente mensaje: ${req.body.message}`
    };

    const transport = nodemailer.createTransport({
    host: process.env.ES_HOST,
    port: process.env.ES_PORT,
    auth: {
    user: process.env.ES_USER,
    pass: process.env.ES_PASS,
    }
    });

    let sendMailStatus = await transport.sendMail(emailMessage);


    let statusMessage = ""

    if(sendMailStatus.rejected.length) {
        statusMessage = "Error al enviar correo";
    }
    else {
        statusMessage = "Mensaje enviado";
    }

    res.render("email", {
        statusMessage,
    });
}
});


module.exports = router;