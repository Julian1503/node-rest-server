require('./config/config');
const express = require("express");
const dp = require("body-parser");
const app = express();

app.use(dp.urlencoded({extended:false}));

app.use(dp.json());


app.get("/",(req,res)=>{
    res.json({"mensaje":"Hola mundo"});
});

app.get("/usuario",(req,res)=>{
    res.json({"mensaje":"get Usuario"});
});

app.get("/usuario/:id",(req,res)=>{
    let id = req.params.id;

    res.json({
        id
    });
});

app.post("/usuario",(req,res)=>{
    let body = req.body;
    if(body.nombre === undefined){
        res.status(400).json({
            ok:false,
            message: "El nombre es necesario"
        });
    }else{
        res.json({body});
    }
});

app.listen( process.env.PORT,()=>{
    console.log(`Escuchando el puerto ${ process.env.PORT}`);
});