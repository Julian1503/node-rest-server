require('./config/config');


const express = require("express");
const dp = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(dp.urlencoded({ extended: false }));

app.use(dp.json());

app.use(require('./routes/user'));

app.get("/", (req, res) => {
    res.json({ "mensaje": process.env.NODE_ENV });
});


mongoose.connect(process.env.URLDB,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    },
    (err, res) => {
        if (err) throw err;
        console.log("Db online");
    });


app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}`);
});