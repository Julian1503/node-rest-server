const jwt = require("jsonwebtoken");

let verificarToken = (req, res, next) =>{
    let token = req.get('token');
    jwt.verify(token,process.env.SEED,(err,decoded)=>{
        if(err){
             return res.status(401).json({
                ok:false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });

};

let verificarAdminRole = (req, res, next) =>{

    if(req.usuario.role === 'ADMIN_ROLE'){
        next();
    }
    return res.status(401).json({
        ok:false,
        err:{
            message: "Usuario sin permiso"
        }
    });
};

module.exports ={
    verificarToken,
    verificarAdminRole
};