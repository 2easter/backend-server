//Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


//Inicializar variables
var app = express();

//Body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Importar las rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');

var loginRoutes = require('./routes/login');

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', ( err, res) => {
    if (err) throw err;
    console.log('Base de datos: ','online');

});


//Rutas
/*app.get('/', function (req, res) {
    res.send('Hello World!');
  });
  Hacemos una carpeta para tener todas nuestras rutas en carpeta y poder tener acceso desde la aplicación. Tenemos que importar las dependencias y al final exportar el archivo.

  En el app.js de principal de la aplicación tenemos que llamar a ese archivo dentro de routes para que funcione.
  var appRoutes = require('./routes/app');
  */
// RUTAS
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// Escuchar peticiones
//app.listen(3000);

app.listen(3000, function () {
    console.log('Está corriendo el servidor en el puerto 3000: ','online');
  });