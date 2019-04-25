var express = require('express');
// Importamos la librería bcrypt para encriptar la contraseña
var bcrypt = require('bcryptjs');

var app = express();
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middleware/autenticacion');

//Esto me permite usar todas las funciones y los métodos que tiene el modelo usuario 
var Usuario = require('../models/usuario');
// =========================
// OBTENER TODOS LOS USUARIOS
// =========================
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
         (err, usuarios )=>{
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuarios',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            usuarios: usuarios
        });
    });
 
});


// =========================
// VERIFICAR TOKEN
// =========================
/*app.use('/', (req, res, next) => {

    var token = req.query.token;

    jwt.verify( token, SEED, (err, decoded ) =>{
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        next(); //esta función sirve para que el programa siga leyendo el código
    });
 
});*/

// Con este método, al poner la validación del token encima de crear, actualizar y borrar usuario, nos aseguramos que siempre está el usuario logeado, pero es mejor crear un middleweare al que se pueda acceder desde otras partes de la aplicación y que usaremos también en la parte de crear médicos y hospitales. Un middleware común para todos los servicios



// =========================
// ACTUALIZAR USUARIO
// =========================
app.put('/:id', mdAutenticacion.verificaToken, ( req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById( id, ( err, usuario)  => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No se ha encontrado ese usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id' + id + 'no existe',
                errors: { message: 'No existe un usuario con ese ID'}
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save( ( err, usuarioGuardado ) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';
    
            res.status(201).json({
                ok: true,
                usuario: usuarioGuardado
            });
    
        });
    }); 
});
// =========================
// CREAR UN NUEVO USUARIOS
// =========================
app.post('/', mdAutenticacion.verificaToken, (req, res)=>{
    var body = req.body;

    // Grabar registro en la base de datos usando mongo

    // Primero creamos referencia a una variable con el modelo de datos tipo usuario
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        // Utilizo el bcrypt.hashSync para encriptar la contraseña
        password: bcrypt.hashSync( body.password, 10 ),
        img: body.img,
        role: body.role
    });

    usuario.save( ( err, usuarioGuardado ) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });

    });

});


// =========================
// ELIMINAR USUARIO
// =========================
app.delete('/:id', mdAutenticacion.verificaToken, ( req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, ( err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + 'no existe',
                errors: { message: 'No existe un usuario con ese ID'}
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    }); 
});

module.exports = app;