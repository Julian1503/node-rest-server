
const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");

const app = express();

let Usuario = require("../models/user");

app.get("/usuario",(req,res)=>{

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
    let filtro = {estado:true};
    Usuario.find(filtro,'nombre email role img google estado')
    .skip(desde)
    .limit(limite)
    .exec((err,usuarios)=>{
        if (err){
            res.status(400)
            .json({
                ok:false,
                err
            });
        }
       
            Usuario.countDocuments(filtro,(err,conteo)=>{
                if (err){
                    res.status(400)
                    .json({
                        ok:false,
                        err
                    });
                }
                res.json({
                    ok:true,
                    usuarios,
                    cuantos:conteo
                });
            });
    });
});

app.delete("/usuario/:id",(req,res)=>{
    let id = req.params.id;
    Usuario.findByIdAndUpdate(id,{ estado:false },{new:true, runValidators: true},(err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                err: "No se encontro el usuario"
            }); 
        }
        res.json({
            ok:true,
            usuario: usuarioDB
        });
    });
});

app.get("/usuario/:id",(req,res)=>{
    let id = req.params.id;

    Usuario.findById(id, (err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                err: "No se encontro el usuario"
            }); 
        }
        res.json({
            ok:true,
            usuario: usuarioDB
        });
    });
});


app.put("/usuario/:id",(req,res)=>{
    let id = req.params.id;

    let body = _.pick(req.body,["nombre","email","img","role","estado"]); 

    let user = Usuario.findByIdAndUpdate(id,body,{new:true, runValidators: true}, (err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        res.json({
            ok:true,
            usuario: usuarioDB
        });
    });
});

app.post("/usuario",(req,res)=>{
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        role: body.role
    });
    usuario.save((err,usuarioDB)=>
    {
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({ok:true,
        usuario: usuarioDB});
    });
});

module.exports = app;