//Puerto

process.env.PORT = process.env.PORT || 3000;


process.env.NODE_ENV = process.env.NODE_ENV ||'dev';

let urlDB;
if(process.env.NODE_ENV==='dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}
else{

    urlDB ='mongodb+srv://paidinfull:Q6qDxTNgOPOlxkkl%40cluster0.fxisk.mongodb.net/cafe';
}
process.env.URLDB = urlDB;