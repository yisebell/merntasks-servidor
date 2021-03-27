const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

const conectarBD = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('Base de datos conectada con exito.');
    } catch (error) {
        console.log(error);
        process.exit(1); // detener la app
    }
}

module.exports = conectarBD;