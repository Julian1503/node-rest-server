const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

let Usuario = require("../models/user");

app.post('/login',(req,res)=>{
    let body = req.body;
    Usuario.findOne({email:body.email},(err,usuarioDb)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!usuarioDb){
            return res.status(400).json({
                ok:false,
                err: "Usuario incorrecto"
            });
        }

        if(!body.password){
            return res.status(400).json({
                ok:false,
                err: "La contraseña es necesaria"
            });
        }

        if(!bcrypt.compareSync(body.password,usuarioDb.password)){
            return res.status(400).json({
                ok:true,
                err: "Contraseña incorrecta"
            });
        }

        let token = jwt.sign({
            usuario:usuarioDb
        },process.env.SEED,{expiresIn:process.env.TOKEN_EXP});

        res.json({
            ok:true,
            usuario:usuarioDb,
            token
        });
    });
});


module.exports = app;