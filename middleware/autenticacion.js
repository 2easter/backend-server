var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;


// =========================
// VERIFICAR TOKEN
// =========================
exports.verificaToken = function(req, res, next) {

    jwt.verify( token, SEED, (err, decoded ) =>{
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next(); //esta función sirve para que el programa siga leyendo el código

    });

};


