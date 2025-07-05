// server.js
require('dotenv').config();
const oracledb = require('oracledb');
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
    const result = await conn.execute(`SELECT * FROM "UBICACION"`, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });
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

//Login con correo
app.post('/api/login', async (req, res) => {
  const { email } = req.body;

  try {
    const conn = await getConnection();
    const result = await conn.execute(
      `SELECT "CONSECUSER", "NOMBRE", "APELLIDO", "USER", "EMAIL", "FECHAREGISTRO"
       FROM "USER"
       WHERE "EMAIL" = :email`,
      [email],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    await conn.close();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Correo no registrado' });
    }

    res.json(result.rows[0]); // devuelve el usuario
  } catch (err) {
    console.error('Error en login:', err.message);
    res.status(500).json({ error: 'Error al procesar login' });
  }
});

// server.js o routes/chat.js
app.get('/api/chat/conversaciones/:idUser', async (req, res) => {
  const { idUser } = req.params;
  try {
    const conn = await getConnection();
    const result = await conn.execute(`
  SELECT * FROM (
    /* ---------- AMIGOS ---------- */
    SELECT
      'amigo' AS tipo,
      u2."CONSECUSER"                       AS id,
      u2."NOMBRE" || ' ' || u2."APELLIDO"   AS nombre,
      m.fecharegmen                         AS ultimaHora,
      m.localizacontenido                   AS ultimoMensaje
    FROM "AMIG_" a
    JOIN "USER" u1 ON u1."CONSECUSER" = a."CONSECUSER"
    JOIN "USER" u2 ON u2."CONSECUSER" = a."USE_CONSECUSER"
    /* último mensaje CON contenido entre los dos */
    LEFT JOIN (
      SELECT
        LEAST(m."CONSECUSER", m."USE_CONSECUSER")  AS u_low,
        GREATEST(m."CONSECUSER", m."USE_CONSECUSER") AS u_high,
        m."FECHAREGMEN"  AS fecharegmen,
        c."LOCALIZACONTENIDO" AS localizacontenido,
        ROW_NUMBER() OVER (
          PARTITION BY LEAST(m."CONSECUSER", m."USE_CONSECUSER"),
                       GREATEST(m."CONSECUSER", m."USE_CONSECUSER")
          ORDER BY m."FECHAREGMEN" DESC
        ) rn
      FROM   MENSAJE m
      JOIN   CONTENIDO c
        ON   c."CONSECUSER"      = m."CONSECUSER"
       AND   NVL(c."USE_CONSECUSER",'X') = NVL(m."USE_CONSECUSER",'X')
       AND   c."CONSMENSAJE"     = m."CONSMENSAJE"
      WHERE  m."CODGRUPO" IS NULL
    ) m
      ON  m.u_low  = LEAST(u1."CONSECUSER", u2."CONSECUSER")
     AND  m.u_high = GREATEST(u1."CONSECUSER", u2."CONSECUSER")
     AND  m.rn = 1
    WHERE a."CONSECUSER" = :idUser

    UNION ALL

    /* ---------- GRUPOS ---------- */
    SELECT
      'grupo'                    AS tipo,
      TO_CHAR(g."CODGRUPO")      AS id,
      g."NOMGRUPO"               AS nombre,
      m.fecharegmen              AS ultimaHora,
      m.localizacontenido        AS ultimoMensaje
    FROM "PERTENECE" p
    JOIN "GRUPO" g ON g."CODGRUPO" = p."CODGRUPO"
    /* último mensaje CON contenido del grupo */
    LEFT JOIN (
      SELECT
        m."CODGRUPO",
        m."FECHAREGMEN"          AS fecharegmen,
        c."LOCALIZACONTENIDO"    AS localizacontenido,
        ROW_NUMBER() OVER (
          PARTITION BY m."CODGRUPO"
          ORDER BY     m."FECHAREGMEN" DESC
        ) rn
      FROM   MENSAJE m
      JOIN   CONTENIDO c
        ON   c."CONSECUSER"      = m."CONSECUSER"
       AND   c."CONSMENSAJE"     = m."CONSMENSAJE"
      WHERE  m."CODGRUPO" IS NOT NULL
    ) m
      ON m."CODGRUPO" = g."CODGRUPO"
     AND m.rn = 1
    WHERE p."CONSECUSER" = :idUser
  )
  ORDER BY ultimaHora DESC
`, [idUser]);

    await conn.close();

    const cols = result.metaData.map(c => c.name.toLowerCase());
    const datos = result.rows.map(r =>
      Object.fromEntries(cols.map((c,i) => [c, r[i]]))
    );
    res.json(datos);
  } catch (err) {
    console.error('Error al obtener conversaciones:', err.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});



//Obtener los ultimo 10 mensajes de Usuarios Y Grupos
app.get('/api/chat/mensajes/:tipo/:idChat/:idUsuario', async (req, res) => {
  const { tipo, idChat, idUsuario } = req.params;

  try {
    const conn = await getConnection();
    let sql, binds;

    /* ────────────── CHAT 1-a-1 ────────────── */
    if (tipo === 'amigo') {
      sql = `
        SELECT *
        FROM (
          SELECT
            m."CONSECUSER"           AS CONSECUSER,
            m."USE_CONSECUSER"       AS USE_CONSECUSER,
            m."CONSMENSAJE"          AS CONSMENSAJE,
            m."FECHAREGMEN"          AS FECHA,
            NVL(c."LOCALIZACONTENIDO",'') AS TEXTO,
            ROW_NUMBER() OVER (ORDER BY m."FECHAREGMEN" DESC) rn
          FROM   "MENSAJE"   m
          JOIN   "CONTENIDO" c
                 ON c."CONSECUSER"      = m."CONSECUSER"
                AND NVL(c."USE_CONSECUSER",'X')
                    = NVL(m."USE_CONSECUSER",'X')
                AND c."CONSMENSAJE"     = m."CONSMENSAJE"
          WHERE  m."CODGRUPO" IS NULL
            AND ((m."CONSECUSER" = :user1 AND m."USE_CONSECUSER" = :user2)
              OR (m."CONSECUSER" = :user2 AND m."USE_CONSECUSER" = :user1))
        )
        WHERE rn <= 10
        ORDER BY FECHA
      `;
      binds = { user1: idUsuario, user2: idChat };

    /* ────────────── CHAT DE GRUPO ────────────── */
    } else if (tipo === 'grupo') {
      sql = `
        SELECT *
        FROM (
          SELECT
            m."CONSECUSER",                           -- id del emisor
            u."NOMBRE" || ' ' || u."APELLIDO" AS REMITENTE,
            m."CONSMENSAJE",
            m."FECHAREGMEN"          AS FECHA,
            NVL(c."LOCALIZACONTENIDO",'') AS TEXTO,
            ROW_NUMBER() OVER (ORDER BY m."FECHAREGMEN" DESC) rn
          FROM   "MENSAJE"   m
          JOIN   "USER"      u ON u."CONSECUSER" = m."CONSECUSER"
          JOIN   "CONTENIDO" c ON c."CONSECUSER" = m."CONSECUSER"
                              AND c."CONSMENSAJE" = m."CONSMENSAJE"
          WHERE  m."CODGRUPO" = :grupo
        )
        WHERE rn <= 10
        ORDER BY FECHA
      `;
      binds = { grupo: idChat };

    } else {
      await conn.close();
      return res.status(400).json({ error: 'Tipo no soportado' });
    }

    const result = await conn.execute(sql, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    await conn.close();

    /*  ⬅️ El front recibirá:
        - CONSECUSER      (id emisor)
        - USE_CONSECUSER  (solo en amigo)
        - REMITENTE       (solo en grupo)
        - CONSMENSAJE
        - FECHA           (ISO)
        - TEXTO
    */
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener mensajes:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});




// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

