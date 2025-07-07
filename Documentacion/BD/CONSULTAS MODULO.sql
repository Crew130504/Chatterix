-- Consulta 1: Obtiene todos los tipos de ubicación disponibles en el sistema.
SELECT * FROM "TIPOUBICA";

-- Consulta 2: Obtiene todas las ubicaciones registradas sin ningún filtro.
SELECT * FROM "UBICACION";

-- Consulta 3: Obtiene todas las ubicaciones filtradas por un tipo específico.
-- El valor :tipo debe corresponder al campo "CODTIPOUBICA".
SELECT * FROM "UBICACION" WHERE "CODTIPOUBICA" = :tipo;
-- Consulta 4: Verifica si ya existe un usuario con el mismo ID o correo electrónico.
-- Retorna 1 si se encuentra una coincidencia en "CONSECUSER" o "EMAIL".
SELECT 1 FROM "USER" WHERE "CONSECUSER" = :id OR "EMAIL" = :mail;

-- Consulta 5: Inserta un nuevo usuario en la tabla "USER".
-- Se insertan los datos básicos del usuario, incluyendo ubicación, nombre, correo y fecha de registro.
-- El campo "FECHAREGISTRO" es convertido desde formato string a tipo DATE.
INSERT INTO "USER"
  ("CONSECUSER", "CODUBICA", "NOMBRE", "APELLIDO", "USER", "FECHAREGISTRO", "EMAIL", "CELULAR")
VALUES
  (:consec, :codu, :nom, :ape, :usr, TO_DATE(:fec, 'YYYY-MM-DD'), :mail, :cel);
-- Consulta 6: Verifica si un nombre de usuario ya existe en la base de datos (ignora mayúsculas/minúsculas).
-- Devuelve 1 si el valor de "USER" coincide (de forma case-insensitive) con el valor recibido.
SELECT 1 FROM "USER" WHERE UPPER("USER") = :username;

-- Consulta 7: Obtiene los datos del usuario (ID, nombre, apellido, alias, correo y fecha de registro)
-- utilizando como criterio el correo electrónico exacto.
SELECT "CONSECUSER", "NOMBRE", "APELLIDO", "USER", "EMAIL", "FECHAREGISTRO"
FROM "USER"
WHERE "EMAIL" = :email;
-- Consulta 8: Obtiene todas las conversaciones (amigos y grupos) asociadas al usuario :idUser.
-- Para cada conversación, muestra el nombre, tipo (amigo/grupo), la hora del último mensaje,
-- el contenido del último mensaje (si lo hay), y el tipo de contenido/archivo.

SELECT * FROM (
  /* ---------- Conversaciones con amigos ---------- */
  SELECT
    'amigo' AS tipo,  -- tipo de conversación
    u2."CONSECUSER"                     AS id,         -- ID del amigo
    u2."NOMBRE"||' '||u2."APELLIDO"     AS nombre,     -- Nombre completo del amigo
    m.fecharegmen                       AS ultimaHora, -- Fecha del último mensaje
    m.localizacontenido                 AS ultimoMensaje,       -- Contenido textual o enlace
    m.idtipocontenido                   AS ultimoTipoContenido, -- Tipo de contenido (texto, imagen, etc.)
    m.idtipoarchivo                     AS ultimoTipoArchivo     -- Tipo de archivo (PDF, BMP, etc.)
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
      ON c."CONSECUSER" = m."CONSECUSER"
     AND NVL(c."USE_CONSECUSER",'X') = NVL(m."USE_CONSECUSER",'X')
     AND c."CONSMENSAJE" = m."CONSMENSAJE"
    WHERE m."CODGRUPO" IS NULL  -- solo mensajes entre usuarios (no grupos)
  ) m
    ON m.u_low  = LEAST(u1."CONSECUSER", u2."CONSECUSER")
   AND m.u_high = GREATEST(u1."CONSECUSER", u2."CONSECUSER")
   AND m.rn = 1
  WHERE a."CONSECUSER" = :idUser

  UNION ALL

  /* ---------- Conversaciones en grupos ---------- */
  SELECT
    'grupo'                       AS tipo,  -- tipo de conversación
    TO_CHAR(g."CODGRUPO")         AS id,    -- ID del grupo
    g."NOMGRUPO"                  AS nombre,-- Nombre del grupo
    m.fecharegmen                 AS ultimaHora, -- Fecha del último mensaje
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
      ON c."CONSECUSER" = m."CONSECUSER"
     AND c."CONSMENSAJE" = m."CONSMENSAJE"
    WHERE m."CODGRUPO" IS NOT NULL  -- solo mensajes de grupo
  ) m
    ON m."CODGRUPO" = g."CODGRUPO"
   AND m.rn = 1
  WHERE p."CONSECUSER" = :idUser
)
ORDER BY ultimaHora DESC;
-- Consulta 9: Obtiene los últimos 10 mensajes intercambiados entre dos usuarios (tipo: "amigo").
-- Incluye los datos del mensaje y, si aplica, información del mensaje al que se responde.
-- Se asegura de mostrar los mensajes ordenados cronológicamente.

SELECT * FROM (
  SELECT
    m."CONSECUSER",                  -- emisor del mensaje
    m."USE_CONSECUSER",             -- receptor del mensaje
    m."CONSMENSAJE",                -- consecutivo del mensaje
    m."FECHAREGMEN"      AS FECHA,  -- fecha de envío
    m."MEN_CONSECUSER"   AS RESP_CONSECUSER,   -- datos del mensaje al que responde
    m."MEN_USE_CONSECUSER" AS RESP_USE_CONSECUSER,
    m."MEN_CONSMENSAJE"  AS RESP_CONSMENSAJE,
    NVL(c."LOCALIZACONTENIDO", '')    AS TEXTO,               -- texto o ruta del contenido
    c."IDTIPOCONTENIDO"               AS IDTIPOCONTENIDO,     -- tipo de contenido (texto, imagen, etc.)
    c."IDTIPOARCHIVO"                 AS IDTIPOARCHIVO,       -- tipo de archivo si aplica (PDF, DOC, etc.)
    c."CONSECONTENIDO"                AS CONSECONTENIDO,      -- ID del contenido
    NVL(uresp."NOMBRE"||' '||uresp."APELLIDO", '') AS RESPUESTA_REMITENTE, -- autor del mensaje respondido
    NVL(cresp."LOCALIZACONTENIDO", '') AS RESPUESTA_TEXTO,                -- texto del mensaje respondido
    NVL(cresp."IDTIPOARCHIVO", '')     AS RESPUESTA_TIPOARCHIVO,
    ROW_NUMBER() OVER (ORDER BY m."FECHAREGMEN" DESC) rn  -- numeración para obtener los últimos 10
  FROM MENSAJE m
  JOIN CONTENIDO c
    ON c."CONSECUSER" = m."CONSECUSER"
   AND NVL(c."USE_CONSECUSER",'X') = NVL(m."USE_CONSECUSER",'X')
   AND c."CONSMENSAJE" = m."CONSMENSAJE"
  LEFT JOIN MENSAJE mresp
    ON mresp."CONSECUSER" = m."MEN_CONSECUSER"
   AND NVL(mresp."USE_CONSECUSER",'X') = NVL(m."MEN_USE_CONSECUSER",'X')
   AND mresp."CONSMENSAJE" = m."MEN_CONSMENSAJE"
  LEFT JOIN CONTENIDO cresp
    ON cresp."CONSECUSER" = mresp."CONSECUSER"
   AND NVL(cresp."USE_CONSECUSER",'X') = NVL(mresp."USE_CONSECUSER",'X')
   AND cresp."CONSMENSAJE" = mresp."CONSMENSAJE"
  LEFT JOIN "USER" uresp
    ON uresp."CONSECUSER" = mresp."CONSECUSER"
  WHERE m."CODGRUPO" IS NULL  -- solo conversaciones uno a uno
    AND (
      (m."CONSECUSER" = :user1 AND NVL(m."USE_CONSECUSER",'X') = :user2)
      OR (m."CONSECUSER" = :user2 AND NVL(m."USE_CONSECUSER",'X') = :user1)
    )
)
WHERE rn <= 10
ORDER BY FECHA;
-- Consulta 10: Obtiene los últimos 10 mensajes enviados en un grupo (tipo: "grupo").
-- Incluye información del remitente, contenido y posibles respuestas asociadas a cada mensaje.

SELECT * FROM (
  SELECT
    m."CONSECUSER",                  -- emisor del mensaje
    m."USE_CONSECUSER",             -- destinatario explícito (puede ser null)
    u."NOMBRE"||' '||u."APELLIDO"   AS REMITENTE,            -- nombre completo del autor
    m."CONSMENSAJE",                -- consecutivo del mensaje
    m."FECHAREGMEN"      AS FECHA,  -- fecha de envío
    m."MEN_CONSECUSER"   AS RESP_CONSECUSER,
    m."MEN_USE_CONSECUSER" AS RESP_USE_CONSECUSER,
    m."MEN_CONSMENSAJE"  AS RESP_CONSMENSAJE,
    NVL(c."LOCALIZACONTENIDO", '')    AS TEXTO,               -- contenido del mensaje
    c."IDTIPOCONTENIDO"               AS IDTIPOCONTENIDO,     -- tipo de contenido
    c."IDTIPOARCHIVO"                 AS IDTIPOARCHIVO,       -- tipo de archivo si aplica
    c."CONSECONTENIDO"                AS CONSECONTENIDO,
    NVL(uresp."NOMBRE"||' '||uresp."APELLIDO", '') AS RESPUESTA_REMITENTE, -- autor del mensaje al que responde
    NVL(cresp."LOCALIZACONTENIDO", '') AS RESPUESTA_TEXTO,
    NVL(cresp."IDTIPOARCHIVO", '')     AS RESPUESTA_TIPOARCHIVO,
    ROW_NUMBER() OVER (ORDER BY m."FECHAREGMEN" DESC) rn
  FROM MENSAJE m
  JOIN "USER" u
    ON u."CONSECUSER" = m."CONSECUSER"
  JOIN CONTENIDO c
    ON c."CONSECUSER" = m."CONSECUSER"
   AND NVL(c."USE_CONSECUSER",'X') = NVL(m."USE_CONSECUSER",'X')
   AND c."CONSMENSAJE" = m."CONSMENSAJE"
  LEFT JOIN MENSAJE mresp
    ON mresp."CONSECUSER" = m."MEN_CONSECUSER"
   AND NVL(mresp."USE_CONSECUSER",'X') = NVL(m."MEN_USE_CONSECUSER",'X')
   AND mresp."CONSMENSAJE" = m."MEN_CONSMENSAJE"
  LEFT JOIN CONTENIDO cresp
    ON cresp."CONSECUSER" = mresp."CONSECUSER"
   AND NVL(cresp."USE_CONSECUSER",'X') = NVL(mresp."USE_CONSECUSER",'X')
   AND cresp."CONSMENSAJE" = mresp."CONSMENSAJE"
  LEFT JOIN "USER" uresp
    ON uresp."CONSECUSER" = mresp."CONSECUSER"
  WHERE m."CODGRUPO" = :grupo
)
WHERE rn <= 10
ORDER BY FECHA;
-- Consulta 11: Genera un nuevo consecutivo de mensaje (CONSMENSAJE) para una conversación.
-- Si es una conversación entre amigos:
-- Busca el mayor CONSMENSAJE entre los dos usuarios y suma 1.
SELECT NVL(MAX(CONSMENSAJE),0)+1 AS NEXT_ID
FROM MENSAJE
WHERE CONSECUSER = :sender AND USE_CONSECUSER = :receiver;

-- Si es una conversación en grupo:
-- Busca el mayor CONSMENSAJE para ese grupo y suma 1.
SELECT NVL(MAX(CONSMENSAJE),0)+1 AS NEXT_ID
FROM MENSAJE
WHERE CODGRUPO = :groupId;
-- Consulta 12: Inserta un nuevo mensaje en la tabla MENSAJE.
-- Registra la relación entre emisor y receptor (o grupo), fecha de envío y referencias si es una respuesta.
INSERT INTO MENSAJE (
  CONSECUSER, USE_CONSECUSER, CONSMENSAJE, CODGRUPO,
  MEN_CONSECUSER, MEN_USE_CONSECUSER, MEN_CONSMENSAJE,
  FECHAREGMEN
) VALUES (
  :sender, :receiver, :msgId, :groupId,
  :menConsec, :menUseConsec, :menConsmsg,
  SYSDATE
);
-- Consulta 13: Inserta un contenido asociado a un mensaje.
-- Puede ser texto o archivo. Usa EMPTY_BLOB() para luego insertar el binario con streaming.
-- Se usa RETURNING para obtener un puntero al BLOB e insertar los datos del archivo en memoria.
INSERT INTO CONTENIDO (
  CONSECUSER, USE_CONSECUSER, CONSMENSAJE, CONSECONTENIDO,
  IDTIPOCONTENIDO, IDTIPOARCHIVO, CONTENIDOIMAG, LOCALIZACONTENIDO
) VALUES (
  :sender, :receiver, :msgId, :cId,
  :tipoCont, :tipoArch, EMPTY_BLOB(), :localTxt
)
RETURNING CONTENIDOIMAG INTO :blob;
-- Consulta 14: Recupera el contenido binario (archivo) y el tipo de archivo asociado
-- a un mensaje específico, identificándolo por:
--   - Emisor (CONSECUSER)
--   - Receptor (USE_CONSECUSER)
--   - ID del mensaje (CONSMENSAJE)
--   - ID del contenido (CONSECONTENIDO)
-- Se utiliza NVL para manejar posibles valores nulos en USE_CONSECUSER (por ejemplo, en mensajes de grupo).

SELECT CONTENIDOIMAG, IDTIPOARCHIVO
FROM CONTENIDO
WHERE CONSECUSER = :u1
  AND NVL(USE_CONSECUSER, 'X') = NVL(:u2, 'X')
  AND CONSMENSAJE = :msg
  AND CONSECONTENIDO = :cont;
