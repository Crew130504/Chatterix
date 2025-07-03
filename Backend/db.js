// db.js
require('dotenv').config(); 
const oracledb = require('oracledb');

// Cargar cliente Oracle desde ruta definida en .env
oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_PATH });


// Configuración de conexión a Oracle
const dbConfig = {
  user: 'interfaz',
  password: '123',
  connectString: 'localhost/XE' // ← Este valor puede variar, lo validaremos después
};

// Función que devuelve la conexión
async function getConnection() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    console.log('Conexión a Oracle exitosa');
    return connection;
  } catch (err) {
    console.error('Error de conexión:', err.message);
    throw err;
  }
}

module.exports = { getConnection };
