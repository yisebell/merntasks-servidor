const express = require('express');
const conectarBD = require('./config/db');
const cors = require('cors');

// Crear el servidor
const app = express();

// Conectar a la base de datos
conectarBD();

// habilitar cors
app.use(cors());

// Habilitar express.json
app.use(express.json({ extended:true }));

// Puerto de la app
const PORT = process.env.PORT;

// Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

/* Definir la pagina principal
app.get('/', (req,res) => {
    res.send('Hola mundo');
});*/

// Arrancar la app
app.listen(PORT, '0.0.0.0', () => {
    console.log(`El servidor está funcionando en el puerto ${PORT}`);
});