# Chatterix – Plataforma social con mensajería en tiempo real y gestión jerárquica de usuarios

**Chatterix** es una aplicación web desarrollada con Angular y Node.js sobre una base de datos Oracle 11g. Permite la creación de una red social con funcionalidades completas de mensajería, administración de usuarios, jerarquía geográfica, configuración de privacidad, contenidos multimedia y pertenencia a grupos.

---
## 🔧 Tecnologías utilizadas

### Frontend
- Angular 17+
- Bootstrap 5
- TypeScript

### Backend
- Node.js (v18+)
- Express
- OracleDB (con Oracle Instant Client)
- Nodemailer (para verificación por correo)
- Multer (manejo de archivos en memoria)

### Base de Datos
- Oracle Database 11g
- Modelo relacional completo con más de 15 tablas, incluyendo relaciones complejas e integridad referencial

---

## Módulos implementados

- Gestión de ubicación geográfica (jerarquía país → provincia)
- Registro y autenticación de usuarios con verificación por email
- Sistema de mensajería privada y grupal con soporte para:
  - Hilos (responder mensajes)
  - Archivos (PDF, DOC, MP4, etc.)
  - Imágenes (JPG, PNG, BMP, etc.)
- Visualización y descarga de contenido multimedia

---

## Estructura del proyecto

```
Chatterix/
├── Backend/
│   ├── db.js
│   ├── server.js
│   ├── mailer.js
│   ├── .env
│   └── package.json
├── Frontend/
│   ├── src/app/
│   │   ├── services/
│   │   ├── components/
│   │   └── pages/
│   │       ├── home/
│   │       ├── chat/
│   │       ├── login /
│   │       └── register-user/
└── Documentacion/
    ├── CONSULTAS MODULO.sql
    ├── script_Modulo_1.sql
    ├── Diagrama Power Designer.pdm
    └── modelo_relacional.pdf
```

---

## Requisitos

- Node.js `>=18`
- Angular CLI
  ```bash
  npm install -g @angular/cli
  ```
- Oracle 11g corriendo en local con el servicio `XE`
- Oracle Instant Client agregado al PATH
- Archivo `.env` con credenciales SMTP y Oracle

---

## Instrucciones de ejecución

### Backend

```bash
cd Backend
npm install
node server.js
```

El backend escuchará en: `http://localhost:3000`

### Frontend

```bash
cd Frontend
npm install
ng serve
```

La aplicación estará disponible en: `http://localhost:4200`

---

## Configuración Oracle UTF-8

```bash
chcp 65001
set NLS_LANG=.AL32UTF8
sqlplus modulo/123@XE
```

---
