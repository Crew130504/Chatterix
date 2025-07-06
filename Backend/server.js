// server.js
require('dotenv').config();
const oracledb = require('oracledb');
const { enviarCodigo } = require('./mailer');
const verificacion = {};
const express = require('express');
const cors = require('cors');
const { getConnection } = require('./db');
const multer = require('multer');
oracledb.fetchAsBuffer = [ oracledb.BLOB ];


const app = express();
const PORT = 3000;

const upload = multer({ storage: multer.memoryStorage() });

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
      u2."CONSECUSER"                     AS id,
      u2."NOMBRE"||' '||u2."APELLIDO"     AS nombre,
      m.fecharegmen                       AS ultimaHora,
      m.localizacontenido                 AS ultimoMensaje,
      m.idtipocontenido                   AS ultimoTipoContenido,
      m.idtipoarchivo                     AS ultimoTipoArchivo
    FROM "AMIG_" a
    JOIN "USER" u1 ON u1."CONSECUSER" = a."CONSECUSER"
    JOIN "USER" u2 ON u2."CONSECUSER" = a."USE_CONSECUSER"
    LEFT JOIN (
      SELECT
        LEAST(m."CONSECUSER", m."USE_CONSECUSER")  AS u_low,
        GREATEST(m."CONSECUSER", m."USE_CONSECUSER") AS u_high,
        m."FECHAREGMEN"       AS fecharegmen,
        c."LOCALIZACONTENIDO" AS localizacontenido,
        c."IDTIPOCONTENIDO"   AS idtipocontenido,
        c."IDTIPOARCHIVO"     AS idtipoarchivo,
        ROW_NUMBER() OVER (
          PARTITION BY LEAST(m."CONSECUSER", m."USE_CONSECUSER"),
                       GREATEST(m."CONSECUSER", m."USE_CONSECUSER")
          ORDER BY m."FECHAREGMEN" DESC
        ) rn
      FROM MENSAJE m
      JOIN CONTENIDO c
        ON c."CONSECUSER"      = m."CONSECUSER"
       AND NVL(c."USE_CONSECUSER",'X') = NVL(m."USE_CONSECUSER",'X')
       AND c."CONSMENSAJE"     = m."CONSMENSAJE"
      WHERE m."CODGRUPO" IS NULL
    ) m
      ON m.u_low  = LEAST(u1."CONSECUSER", u2."CONSECUSER")
     AND m.u_high = GREATEST(u1."CONSECUSER", u2."CONSECUSER")
     AND m.rn = 1
    WHERE a."CONSECUSER" = :idUser

    UNION ALL

    /* ---------- GRUPOS ---------- */
    SELECT
      'grupo'                       AS tipo,
      TO_CHAR(g."CODGRUPO")         AS id,
      g."NOMGRUPO"                  AS nombre,
      m.fecharegmen                 AS ultimaHora,
      m.localizacontenido           AS ultimoMensaje,
      m.idtipocontenido             AS ultimoTipoContenido,
      m.idtipoarchivo               AS ultimoTipoArchivo
    FROM "PERTENECE" p
    JOIN "GRUPO" g
      ON g."CODGRUPO" = p."CODGRUPO"
    LEFT JOIN (
      SELECT
        m."CODGRUPO",
        m."FECHAREGMEN"       AS fecharegmen,
        c."LOCALIZACONTENIDO" AS localizacontenido,
        c."IDTIPOCONTENIDO"   AS idtipocontenido,
        c."IDTIPOARCHIVO"     AS idtipoarchivo,
        ROW_NUMBER() OVER (
          PARTITION BY m."CODGRUPO"
          ORDER BY m."FECHAREGMEN" DESC
        ) rn
      FROM MENSAJE m
      JOIN CONTENIDO c
        ON c."CONSECUSER"      = m."CONSECUSER"
       AND c."CONSMENSAJE"     = m."CONSMENSAJE"
      WHERE m."CODGRUPO" IS NOT NULL
    ) m
      ON m."CODGRUPO" = g."CODGRUPO"
     AND m.rn = 1
    WHERE p."CONSECUSER" = :idUser
  )
  ORDER BY ultimaHora DESC
`, [idUser]);

    await conn.close();
    // JSON salen ahora: tipo,id,nombre,ultimaHora,ultimoMensaje,ultimoTipoContenido,ultimoTipoArchivo
    const cols = result.metaData.map(c => c.name.toLowerCase());
    const datos = result.rows.map(r =>
      Object.fromEntries(cols.map((c,i) => [c, r[i]]))
    );
    res.json(datos);

  } catch (err) {
    console.error('Error al obtener conversaciones:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});




app.get('/api/chat/mensajes/:tipo/:idChat/:idUsuario', async (req, res) => {
  const { tipo, idChat, idUsuario } = req.params;
  try {
    const conn = await getConnection();
    let sql, binds;

    if (tipo === 'amigo') {
      sql = `
        SELECT * FROM (
          SELECT
            m."CONSECUSER",
            m."USE_CONSECUSER",
            m."CONSMENSAJE",
            m."FECHAREGMEN"      AS FECHA,
            m."MEN_CONSECUSER"   AS RESP_CONSECUSER,
            m."MEN_USE_CONSECUSER" AS RESP_USE_CONSECUSER,
            m."MEN_CONSMENSAJE"  AS RESP_CONSMENSAJE,
            NVL(c."LOCALIZACONTENIDO", '')    AS TEXTO,
            c."IDTIPOCONTENIDO"               AS IDTIPOCONTENIDO,
            c."IDTIPOARCHIVO"                 AS IDTIPOARCHIVO,
            c."CONSECONTENIDO"                AS CONSECONTENIDO,
            NVL(uresp."NOMBRE"||' '||uresp."APELLIDO", '') AS RESPUESTA_REMITENTE,
            NVL(cresp."LOCALIZACONTENIDO", '') AS RESPUESTA_TEXTO,
            ROW_NUMBER() OVER (ORDER BY m."FECHAREGMEN" DESC) rn
          FROM MENSAJE m
          JOIN CONTENIDO c
            ON c."CONSECUSER"       = m."CONSECUSER"
           AND NVL(c."USE_CONSECUSER",'X') = NVL(m."USE_CONSECUSER",'X')
           AND c."CONSMENSAJE"      = m."CONSMENSAJE"
          LEFT JOIN MENSAJE mresp
            ON mresp."CONSECUSER"          = m."MEN_CONSECUSER"
           AND NVL(mresp."USE_CONSECUSER",'X') = NVL(m."MEN_USE_CONSECUSER",'X')
           AND mresp."CONSMENSAJE"         = m."MEN_CONSMENSAJE"
          LEFT JOIN CONTENIDO cresp
            ON cresp."CONSECUSER"            = mresp."CONSECUSER"
           AND NVL(cresp."USE_CONSECUSER",'X') = NVL(mresp."USE_CONSECUSER",'X')
           AND cresp."CONSMENSAJE"           = mresp."CONSMENSAJE"
          LEFT JOIN "USER" uresp
            ON uresp."CONSECUSER" = mresp."CONSECUSER"
          WHERE m."CODGRUPO" IS NULL
            AND (
              (m."CONSECUSER" = :user1 AND NVL(m."USE_CONSECUSER",'X') = :user2)
              OR (m."CONSECUSER" = :user2 AND NVL(m."USE_CONSECUSER",'X') = :user1)
            )
        )
        WHERE rn <= 10
        ORDER BY FECHA
      `;
      binds = { user1: idUsuario, user2: idChat };

    } else if (tipo === 'grupo') {
      sql = `
        SELECT * FROM (
          SELECT
            m."CONSECUSER",
            m."USE_CONSECUSER",
            u."NOMBRE"||' '||u."APELLIDO"     AS REMITENTE,
            m."CONSMENSAJE",
            m."FECHAREGMEN"                    AS FECHA,
            m."MEN_CONSECUSER"                 AS RESP_CONSECUSER,
            m."MEN_USE_CONSECUSER"             AS RESP_USE_CONSECUSER,
            m."MEN_CONSMENSAJE"                AS RESP_CONSMENSAJE,
            NVL(c."LOCALIZACONTENIDO", '')     AS TEXTO,
            c."IDTIPOCONTENIDO"                AS IDTIPOCONTENIDO,
            c."IDTIPOARCHIVO"                  AS IDTIPOARCHIVO,
            c."CONSECONTENIDO"                 AS CONSECONTENIDO,
            NVL(uresp."NOMBRE"||' '||uresp."APELLIDO", '') AS RESPUESTA_REMITENTE,
            NVL(cresp."LOCALIZACONTENIDO", '') AS RESPUESTA_TEXTO,
            ROW_NUMBER() OVER (ORDER BY m."FECHAREGMEN" DESC) rn
          FROM MENSAJE m
          JOIN "USER" u
            ON u."CONSECUSER" = m."CONSECUSER"
          JOIN CONTENIDO c
            ON c."CONSECUSER"       = m."CONSECUSER"
           AND NVL(c."USE_CONSECUSER",'X') = NVL(m."USE_CONSECUSER",'X')
           AND c."CONSMENSAJE"      = m."CONSMENSAJE"
          LEFT JOIN MENSAJE mresp
            ON mresp."CONSECUSER"          = m."MEN_CONSECUSER"
           AND NVL(mresp."USE_CONSECUSER",'X') = NVL(m."MEN_USE_CONSECUSER",'X')
           AND mresp."CONSMENSAJE"         = m."MEN_CONSMENSAJE"
          LEFT JOIN CONTENIDO cresp
            ON cresp."CONSECUSER"            = mresp."CONSECUSER"
           AND NVL(cresp."USE_CONSECUSER",'X') = NVL(mresp."USE_CONSECUSER",'X')
           AND cresp."CONSMENSAJE"           = mresp."CONSMENSAJE"
          LEFT JOIN "USER" uresp
            ON uresp."CONSECUSER" = mresp."CONSECUSER"
          WHERE m."CODGRUPO" = :grupo
        )
        WHERE rn <= 10
        ORDER BY FECHA
      `;
      binds = { grupo: Number(idChat) };

    } else {
      return res.status(400).json({ error: 'Tipo no soportado' });
    }

    const result = await conn.execute(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });
    await conn.close();
    res.json(result.rows);

  } catch (err) {
    console.error('Error al obtener mensajes:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});


app.post(
  '/api/chat/mensajes/:tipo/:idChat/:idUsuario',
  upload.single('file'),
  async (req, res) => {
    const { tipo, idChat, idUsuario } = req.params;
    const { texto, respuestaDe } = req.body;
    const file = req.file; // si hay archivo, multer lo coloca aquí
    console.log('[DEBUG] Tipo:', tipo);
    console.log('[DEBUG] Texto recibido:', texto);
    console.log('[DEBUG] Archivo recibido:', file);

    const esAmigo = tipo === 'amigo';
    let conn;

    try {
      conn = await getConnection();

      // 1) Generar nuevo ID de mensaje
      const seqSql = esAmigo
        ? `SELECT NVL(MAX(CONSMENSAJE),0)+1 AS NEXT_ID
           FROM MENSAJE
          WHERE CONSECUSER = :sender AND USE_CONSECUSER = :receiver`
        : `SELECT NVL(MAX(CONSMENSAJE),0)+1 AS NEXT_ID
           FROM MENSAJE
          WHERE CODGRUPO = :groupId`;

      const seqBinds = esAmigo
        ? { sender: idUsuario, receiver: idChat }
        : { groupId: Number(idChat) };

      const seqResult = await conn.execute(seqSql, seqBinds, {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      });
      const nextId = seqResult.rows[0].NEXT_ID;
      console.log('[DEBUG] nextId mensaje:', nextId);

      // 2) Insertar en MENSAJE
      const [menConsec, menUseConsec, menConsmensaje] = respuestaDe || [null, null, null];
      await conn.execute(
        `INSERT INTO MENSAJE (
           CONSECUSER, USE_CONSECUSER, CONSMENSAJE, CODGRUPO,
           MEN_CONSECUSER, MEN_USE_CONSECUSER, MEN_CONSMENSAJE,
           FECHAREGMEN
         ) VALUES (
           :sender, :receiver, :msgId, :groupId,
           :menConsec, :menUseConsec, :menConsmsg,
           SYSDATE
         )`,
        {
          sender: idUsuario,
          receiver: esAmigo ? idChat : idUsuario,
          msgId: nextId,
          groupId: esAmigo ? null : Number(idChat),
          menConsec,
          menUseConsec,
          menConsmsg: menConsmensaje
        }
      );
      console.log('[DEBUG] Mensaje insertado en MENSAJE');

      // 3) Preparar contenidos (texto y/o archivo)
      const contenidos = [];
      let contentId = 1;

      if (texto) {
        contenidos.push({
          conseContenido: contentId++,
          idTipoContenido: '2', // ej. '2' = texto
          idTipoArchivo: null,
          buffer: null,
          local: texto
        });
      }

      if (file) {
        // determina el IDTIPOARCHIVO según file.mimetype o file.originalname
        // aquí un ejemplo simplificado:
        const ext = file.originalname.split('.').pop().toLowerCase();
        let idTipoArchivo = null;
        switch (ext) {
          case 'png': idTipoArchivo = 'GIF'; break;
          case 'jpg':
          case 'jpeg': idTipoArchivo = 'BMP'; break;
          case 'pdf': idTipoArchivo = 'PDF'; break;
          // añade más casos según tu catálogo
          default: idTipoArchivo = null;
        }

        contenidos.push({
          conseContenido: contentId++,
          idTipoContenido: '1', // ej. '1' = imagen/archivo
          idTipoArchivo,
          buffer: file.buffer,
          local: null
        });
      }

      // 4) Insertar cada contenido
      for (const c of contenidos) {
        console.log('[DEBUG] Insertando contenido:', c);
        await conn.execute(
          `INSERT INTO CONTENIDO (
             CONSECUSER, USE_CONSECUSER, CONSMENSAJE, CONSECONTENIDO,
             IDTIPOCONTENIDO, IDTIPOARCHIVO, CONTENIDOIMAG, LOCALIZACONTENIDO
           ) VALUES (
             :sender, :receiver, :msgId, :cId,
             :tipoCont, :tipoArch, EMPTY_BLOB(), :localTxt
           )
           RETURNING CONTENIDOIMAG INTO :blob`,
          {
            sender: idUsuario,
            receiver: esAmigo ? idChat : idUsuario,
            msgId: nextId,
            cId: c.conseContenido,
            tipoCont: c.idTipoContenido,
            tipoArch: c.idTipoArchivo,
            localTxt: c.local,
            blob: { type: oracledb.BLOB, dir: oracledb.BIND_OUT }
          },
          { autoCommit: false }
        ).then(async result => {
          if (c.buffer) {
            const lob = result.outBinds.blob[0];
            await lob.write(c.buffer);
            lob.close();
          }
        });
      }

      // 5) Commit una sola vez
      await conn.commit();
      console.log('[DEBUG] Commit realizado');

      res.status(201).json({ success: true, newMessageId: nextId });
    } catch (err) {
      console.error('Error enviando mensaje:', err);
      if (conn) await conn.rollback();
      res.status(500).json({ error: err.message });
    } finally {
      if (conn) await conn.close();
    }
  }
);
// Descarga de archivo BLOB
app.get(
  '/api/chat/archivo/:consecUser/:useConsecUser/:msgId/:contId',
  async (req, res) => {
    const { consecUser, useConsecUser, msgId, contId } = req.params;
    let conn;
    try {
      conn = await getConnection();
      const result = await conn.execute(
        `SELECT CONTENIDOIMAG, IDTIPOARCHIVO
           FROM CONTENIDO
          WHERE CONSECUSER = :u1
            AND NVL(USE_CONSECUSER,'X') = NVL(:u2,'X')
            AND CONSMENSAJE = :msg
            AND CONSECONTENIDO = :cont`,
        {
          u1: consecUser,
          u2: useConsecUser,
          msg: Number(msgId),
          cont: Number(contId)
        },
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT
          // <-- gracias a fetchAsBuffer, CONTENIDOIMAG vendrá como Buffer
        }
      );

      if (result.rows.length === 0) return res.status(404).end();

      const { CONTENIDOIMAG, IDTIPOARCHIVO } = result.rows[0];
      // Para que el navegador muestre PDF en línea:
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `inline; filename="archivo.${IDTIPOARCHIVO.toLowerCase()}"`
      );
      res.send(CONTENIDOIMAG);
    } catch (err) {
      console.error('Error al enviar archivo:', err);
      res.status(500).end();
    } finally {
      if (conn) await conn.close();
    }
  }
);



// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

