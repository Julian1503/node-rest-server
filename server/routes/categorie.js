const express = require('express');
const _ = require("underscore");

let Categorie = require("../models/categorie");
const { verificarToken, verificarAdminRole } = require("../middlewares/authentication");

const app = express();

app.get("/categoria", verificarToken, (req, res) => {
    Categorie.find({})
        .exec((err, categoriaDb) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!categoriaDb) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "No se encontraron categorias"
                    }
                });
            }

            return res.json({
                ok: true,
                categoria: categoriaDb
            });
        });
});

app.get("/categoria/:id", verificarToken, (req, res) => {
    let id = req.params.id;
    Categorie.findById(id, (err, categoriaDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se encontro la categoria"
                }
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaDb
        });
    });
});

app.post("/categoria", verificarToken, (req, res) => {
    let body = req.body;

    let categoria = new Categorie({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se encontro la categoria"
                }
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaDb
        });

    });

});

app.put('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;

    Categorie.findByIdAndUpdate(id,
        { descripcion: req.body.descripcion },
        { new: true, runValidators: true, context: "query", },
        (err, categoriaDb) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!categoriaDb) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "No se encontro la categoria"
                    }
                });
            }

            return res.json({
                ok: true,
                categoria: categoriaDb
            });

        });
});

app.delete('/categoria/:id', [verificarToken, verificarAdminRole], (req, res) => {
    let id = req.params.id;

    Categorie.findByIdAndRemove(id,
        (err, categoriaDb) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!categoriaDb) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "No se encontro la categoria"
                    }
                });
            }

            return res.json({
                ok: true,
                categoria: categoriaDb
            });

        });
});

module.exports = app;