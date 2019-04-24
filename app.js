//Requires
var express = require('express');
var mongoose = require('mongoose');


//Inicializar variables
var app = express();

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', ( err, res) => {
    if (err) throw err;
    console.log('Base de datos: ','online');

});


//Rutas
/*app.get('/', function (req, res) {
    res.send('Hello World!');
  });*/

app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });

});

// Escuchar peticiones
//app.listen(3000);

app.listen(3000, function () {
    console.log('Está corriendo el servidor en el puerto 3000: ','online');
  });