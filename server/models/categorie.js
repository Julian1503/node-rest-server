const mongoose = require("mongoose");
const validator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let Categorie = new Schema({
    descripcion:{
        type: String,
        required: [true,"La descripcion es necesaria"],
        unique:true
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

Categorie.plugin(validator,{
    message: '{PATH} debe de ser unico'
});

module.exports = mongoose.model("Categorie",Categorie);