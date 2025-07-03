# GeoUser – Registro geográfico con verificación por correo

**GeoUser** es una aplicación web construida con Angular y Node.js que permite registrar usuarios con su ubicación geográfica jerárquica (país → departamento → ciudad → área → provincia). Incluye verificación de correo electrónico mediante envío de código, y almacenamiento de datos en una base de datos Oracle 11g.

---

## Tecnologías

### Frontend
- Angular 17+ 
- Bootstrap 5 
- TypeScript

### Backend
- Node.js (v18+)
- Express
- oracledb (requiere Oracle Instant Client)
- Nodemailer

### Base de Datos
- Oracle Database 11g
- Modelo jerárquico con las tablas: `TIPOUBICA`, `UBICACION`, `"USER"`

---

## Requisitos previos

- Node.js `>=18`
- Angular CLI:

```bash
npm install -g @angular/cli
````

* Oracle Database 11g corriendo localmente
* Oracle Instant Client instalado y agregado al `PATH`
* Archivo `.env` configurado en el backend:

```env
ORACLE_CLIENT_PATH=C:\ruta\a\instantclient
SENDGRID_API_KEY=TU_CLAVE_API
MAIL_FROM=GeoUser <tu_correo@proveedor.com>
```

---

## Estructura del proyecto

```
GeoUser/
├── Backend/
│   ├── db.js
│   ├── mailer.js
│   ├── server.js
│   ├── .env
│   └── package.json
├── src/
│   ├── app/
│   │   ├── services/
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   └── register-user/
│   ├── assets/
│   └── styles.css
└── angular.json
```

---

## Ejecución del proyecto

### Backend

1. Instala las dependencias:

```bash
cd Backend
npm install
```

2. Ejecuta el servidor:

```bash
node server.js
```

El backend escuchará en: `http://localhost:3000`

> Nota: El archivo `db.js` utiliza la cadena de conexión:
> `connectString: 'localhost:1521/XE'`

### Frontend

1. Instala las dependencias:

```bash
npm install
```

2. Ejecuta el proyecto:

```bash
ng serve
```

Accede desde el navegador en: `http://localhost:4200`

---

## Funcionalidades principales

* Registro de usuarios con formulario reactivo
* Selección jerárquica de ubicación: país → departamento → ciudad → área → provincia
* Validación de correo electrónico mediante código (SendGrid)
* Inserción de datos en tabla `"USER"` de Oracle
* Soporte jerárquico mediante la columna `UBICA_SUP`
* Manejo correcto de caracteres UTF-8 (tildes, ñ, etc.)

---

## Pruebas y validaciones

* Puedes usar los scripts `INSERT` incluidos para cargar datos de prueba en Oracle.
* Para verificar ubicaciones hijas:

```sql
SELECT * FROM "UBICACION" WHERE "UBICA_SUP" = 'cod_padre';
```

---

## Configuración de Oracle UTF-8

Antes de ejecutar la base de datos, asegúrate de establecer el entorno en UTF-8 para evitar errores de codificación Unicode. En la terminal (CMD):

```bash
chcp 65001
set NLS_LANG=.AL32UTF8
sqlplus tu_usuario/tu_contraseña@tu_conexion
```

---

## Notas finales

* Oracle debe estar corriendo localmente en `localhost:1521` con el servicio `XE`.
* El usuario de la base de datos debe llamarse `INTERFAZ` con contraseña `123` (puedes modificar esto en la conexión del backend).
* Asegúrate de tener configurado correctamente `ORACLE_CLIENT_PATH` y que SendGrid tenga permisos para enviar correos.

