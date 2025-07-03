// server.js
require('dotenv').config();
const { enviarCodigo } = require('./mailer');
const verificacion = {};
const express = require('express');
const cors = require('cors');
const { getConnection } = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Middleware global para forzar charset UTF-8
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Obtener tipos de ubicación
app.get('/api/tipoubica', async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute(`SELECT * FROM "TIPOUBICA"`);
    res.json(result.rows);
    await conn.close();
  } catch (err) {
    console.error('Error al obtener tipos de ubicación:', err.message);
    res.status(500).json({ error: 'Error interno en el servidor' });
  }
});

// Obtener ubicaciones
app.get('/api/ubicaciones', async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute(`SELECT * FROM "UBICACION"`);
    res.json(result.rows);
    await conn.close();
  } catch (err) {
    console.error('Error al obtener ubicaciones:', err.message);
    res.status(500).json({ error: 'Error interno en el servidor' });
  }
});

// Obtener ubicaciones por tipo
app.get('/api/ubicaciones/tipo/:tipo', async (req, res) => {
  const tipo = req.params.tipo;
  try {
    const conn = await getConnection();
    const result = await conn.execute(
      `SELECT * FROM "UBICACION" WHERE "CODTIPOUBICA" = :tipo`,
      [tipo]
    );
    res.json(result.rows);
    await conn.close();
  } catch (err) {
    console.error('Error al filtrar ubicaciones:', err.message);
    res.status(500).json({ error: 'Error interno en el servidor' });
  }
});

// Registrar usuario
app.post('/api/usuarios', async (req, res) => {
  const idGenerado = Math.floor(10000 + Math.random() * 90000).toString();

  const {
    consecUser, codUbica, nombre, apellido, user,
    fechaRegistro, email, celular
  } = req.body;

  try {
    const conn = await getConnection();

    const check = await conn.execute(
      `SELECT 1 FROM "USER" WHERE "CONSECUSER" = :id OR "EMAIL" = :mail`,
      {
        id: consecUser,
        mail: email
      }
    );

    if (check.rows.length > 0) {
      await conn.close();
      return res.status(400).json({ error: 'El usuario ya está registrado' });
    }

    await conn.execute(
      `INSERT INTO "USER"
      ("CONSECUSER", "CODUBICA", "NOMBRE", "APELLIDO", "USER", "FECHAREGISTRO", "EMAIL", "CELULAR")
      VALUES (:consec, :codu, :nom, :ape, :usr, TO_DATE(:fec, 'YYYY-MM-DD'), :mail, :cel)`,
      {
        consec: idGenerado,
        codu: codUbica,
        nom: nombre,
        ape: apellido,
        usr: user,
        fec: fechaRegistro,
        mail: email,
        cel: celular
      },
      { autoCommit: true }
    );

    await conn.close();
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (err) {
    console.error('Error al registrar usuario:', err.message);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

// Validar correo
app.post('/api/validar-correo', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Correo requerido' });

  const codigo = Math.floor(100000 + Math.random() * 900000).toString();
  verificacion[email] = codigo;

  try {
    await enviarCodigo(email, codigo);
    res.status(200).json({ message: 'Código enviado' });
  } catch (err) {
    console.error('Error al enviar correo:', err.message);
    res.status(500).json({ error: 'No se pudo enviar el correo' });
  }
});

// Verificar código
app.post('/api/verificar-codigo', (req, res) => {
  const { email, codigo } = req.body;
  if (verificacion[email] === codigo) {
    delete verificacion[email];
    return res.status(200).json({ validado: true });
  }
  res.status(400).json({ validado: false, error: 'Código incorrecto' });
});

// Verificar si el usuario ya existe
app.get('/api/usuarios/existe/:user', async (req, res) => {
  const username = req.params.user.toUpperCase(); // comparar sin importar mayúsculas
  try {
    const conn = await getConnection();
    const result = await conn.execute(
      `SELECT 1 FROM "USER" WHERE UPPER("USER") = :username`,
      [username]
    );
    await conn.close();
    res.json({ exists: result.rows.length > 0 });
  } catch (err) {
    console.error('Error al verificar usuario:', err.message);
    res.status(500).json({ error: 'Error en la verificación' });
  }
});


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

