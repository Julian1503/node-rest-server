
const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");

const app = express();
const { verificarToken, verificarAdminRole } = require("../middlewares/authentication");
let Usuario = require("../models/user");

app.get("/usuario", verificarToken, (req,res)=>{

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
    let filtro = {estado:true};
    Usuario.find(filtro,'nombre email role img google estado')
    .skip(desde)
    .limit(limite)
    .exec((err,usuarios)=>{
        if (err){
            return res.status(400)
            .json({
                ok:false,
                err
            });
        }
       
            Usuario.countDocuments(filtro,(err,conteo)=>{
                if (err){
                    return res.status(400)
                    .json({
                        ok:false,
                        err
                    });
                }
                return res.json({
                    ok:true,
                    usuarios,
                    cuantos:conteo
                });
            });
    });
});

app.delete("/usuario/:id",[verificarToken, verificarAdminRole],(req,res)=>{
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

app.get("/usuario/:id",verificarToken,(req,res)=>{
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
        return res.json({
            ok:true,
            usuario: usuarioDB
        });
    });
});


app.put("/usuario/:id",[verificarToken],(req,res)=>{
    let id = req.params.id;

    let body = _.pick(req.body,["nombre","email","img","role","estado"]); 

    let user = Usuario.findByIdAndUpdate(id,body,{new:true, context:"query",runValidators: true}, (err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        return res.json({
            ok:true,
            usuario: usuarioDB
        });
    });
});

app.post("/usuario",[verificarToken],(req,res)=>{
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
            return res.status(500).json({
                ok:false,
                err
            });
        }

        return res.json({ok:true,
        usuario: usuarioDB});
    });
});

module.exports = app;