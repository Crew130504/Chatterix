-- TIPOUBICA
INSERT INTO TIPOUBICA (CODTIPOUBICA,DESCTIPOUBICA) VALUES ('1','País');
INSERT INTO TIPOUBICA (CODTIPOUBICA,DESCTIPOUBICA) VALUES ('2','Departamento');
INSERT INTO TIPOUBICA (CODTIPOUBICA,DESCTIPOUBICA) VALUES ('3','Ciudad');
INSERT INTO TIPOUBICA (CODTIPOUBICA,DESCTIPOUBICA) VALUES ('4','Area');
INSERT INTO TIPOUBICA (CODTIPOUBICA,DESCTIPOUBICA) VALUES ('5','Provincia');

-- UBICACION
INSERT INTO UBICACION (CODUBICA,NOMUBICA,CODTIPOUBICA,UBI_CODUBICA) VALUES ('57','Colombia','1',NULL);
INSERT INTO UBICACION (CODUBICA,NOMUBICA,CODTIPOUBICA,UBI_CODUBICA) VALUES ('1','E.U','1',NULL);
INSERT INTO UBICACION (CODUBICA,NOMUBICA,CODTIPOUBICA,UBI_CODUBICA) VALUES ('34','España','1',NULL);
INSERT INTO UBICACION (CODUBICA,NOMUBICA,CODTIPOUBICA,UBI_CODUBICA) VALUES ('54','Argentina','1',NULL);
INSERT INTO UBICACION (CODUBICA,NOMUBICA,CODTIPOUBICA,UBI_CODUBICA) VALUES ('05','Antioquia','2','57');
INSERT INTO UBICACION (CODUBICA,NOMUBICA,CODTIPOUBICA,UBI_CODUBICA) VALUES ('81','Arauca','2','57');
INSERT INTO UBICACION (CODUBICA,NOMUBICA,CODTIPOUBICA,UBI_CODUBICA) VALUES ('11','Bogotá','2','57');
INSERT INTO UBICACION (CODUBICA,NOMUBICA,CODTIPOUBICA,UBI_CODUBICA) VALUES ('15','Boyacá','2','57');
INSERT INTO UBICACION (CODUBICA,NOMUBICA,CODTIPOUBICA,UBI_CODUBICA) VALUES ('25','Cundinamarca','2','57');
INSERT INTO UBICACION (CODUBICA,NOMUBICA,CODTIPOUBICA,UBI_CODUBICA) VALUES ('205','Alabama','4','1');
INSERT INTO UBICACION (CODUBICA,NOMUBICA,CODTIPOUBICA,UBI_CODUBICA) VALUES ('907','Alaska','4','1');
INSERT INTO UBICACION (CODUBICA,NOMUBICA,CODTIPOUBICA,UBI_CODUBICA) VALUES ('209','California','4','1');

-- TIPOCONTENIDO
INSERT INTO TIPOCONTENIDO (IDTIPOCONTENIDO,DESCTIPOCONTENIDO) VALUES ('1','Imagen');
INSERT INTO TIPOCONTENIDO (IDTIPOCONTENIDO,DESCTIPOCONTENIDO) VALUES ('2','Texto');
INSERT INTO TIPOCONTENIDO (IDTIPOCONTENIDO,DESCTIPOCONTENIDO) VALUES ('3','Emoticons');
INSERT INTO TIPOCONTENIDO (IDTIPOCONTENIDO,DESCTIPOCONTENIDO) VALUES ('4','Url');
INSERT INTO TIPOCONTENIDO (IDTIPOCONTENIDO,DESCTIPOCONTENIDO) VALUES ('5','Video');

-- TIPOARCHIVO
INSERT INTO TIPOARCHIVO (IDTIPOARCHIVO,DESCTIPOARCHIVO) VALUES ('1','PDF Documento Portable');
INSERT INTO TIPOARCHIVO (IDTIPOARCHIVO,DESCTIPOARCHIVO) VALUES ('2','DOC Documento');
INSERT INTO TIPOARCHIVO (IDTIPOARCHIVO,DESCTIPOARCHIVO) VALUES ('3','XLS Hoja Calculo');
INSERT INTO TIPOARCHIVO (IDTIPOARCHIVO,DESCTIPOARCHIVO) VALUES ('4','GIF Imagen');
INSERT INTO TIPOARCHIVO (IDTIPOARCHIVO,DESCTIPOARCHIVO) VALUES ('5','BMP Imagen');
INSERT INTO TIPOARCHIVO (IDTIPOARCHIVO,DESCTIPOARCHIVO) VALUES ('6','MP4 Video');
INSERT INTO TIPOARCHIVO (IDTIPOARCHIVO,DESCTIPOARCHIVO) VALUES ('7','AVI Video');
INSERT INTO TIPOARCHIVO (IDTIPOARCHIVO,DESCTIPOARCHIVO) VALUES ('8','MP3 Musica');
INSERT INTO TIPOARCHIVO (IDTIPOARCHIVO,DESCTIPOARCHIVO) VALUES ('9','EXE ejecutable');

-- "USER"
INSERT INTO "USER" (CONSECUSER,CODUBICA,USE_CONSECUSER,NOMBRE,APELLIDO,"USER",FECHAREGISTRO,EMAIL,CELULAR) 
VALUES ('U0001','11',NULL,'Juan','Pérez','juanp',TO_DATE('2025-06-04 20:59:41','YYYY-MM-DD HH24:MI:SS'),'juan@mail.com','3101111111');

INSERT INTO "USER" (CONSECUSER,CODUBICA,USE_CONSECUSER,NOMBRE,APELLIDO,"USER",FECHAREGISTRO,EMAIL,CELULAR) 
VALUES ('U0002','209',NULL,'María','Gómez','mariag',TO_DATE('2025-06-05 20:59:41','YYYY-MM-DD HH24:MI:SS'),'maria@mail.com','3102222222');

INSERT INTO "USER" (CONSECUSER,CODUBICA,USE_CONSECUSER,NOMBRE,APELLIDO,"USER",FECHAREGISTRO,EMAIL,CELULAR) 
VALUES ('U0003','57',NULL,'Carlos','López','carlos',TO_DATE('2025-06-06 20:59:41','YYYY-MM-DD HH24:MI:SS'),'carlos@mail.com','3103333333');

INSERT INTO "USER" (CONSECUSER,CODUBICA,USE_CONSECUSER,NOMBRE,APELLIDO,"USER",FECHAREGISTRO,EMAIL,CELULAR) 
VALUES ('U0004','1',NULL,'Ana','Rodríguez','anar',TO_DATE('2025-06-07 20:59:41','YYYY-MM-DD HH24:MI:SS'),'ana@mail.com','3104444444');

INSERT INTO "USER" (CONSECUSER,CODUBICA,USE_CONSECUSER,NOMBRE,APELLIDO,"USER",FECHAREGISTRO,EMAIL,CELULAR) 
VALUES ('U0005','34',NULL,'Pedro','Martínez','pedrom',TO_DATE('2025-06-08 20:59:41','YYYY-MM-DD HH24:MI:SS'),'pedro@mail.com','3105555555');

INSERT INTO "USER" (CONSECUSER,CODUBICA,USE_CONSECUSER,NOMBRE,APELLIDO,"USER",FECHAREGISTRO,EMAIL,CELULAR) 
VALUES ('U0006','54',NULL,'Laura','Díaz','laurad',TO_DATE('2025-06-09 20:59:41','YYYY-MM-DD HH24:MI:SS'),'laura@mail.com','3106666666');

INSERT INTO "USER" (CONSECUSER,CODUBICA,USE_CONSECUSER,NOMBRE,APELLIDO,"USER",FECHAREGISTRO,EMAIL,CELULAR) 
VALUES ('U0007','11',NULL,'David','Hernández','davidh',TO_DATE('2025-06-10 20:59:41','YYYY-MM-DD HH24:MI:SS'),'david@mail.com','3107777777');

INSERT INTO "USER" (CONSECUSER,CODUBICA,USE_CONSECUSER,NOMBRE,APELLIDO,"USER",FECHAREGISTRO,EMAIL,CELULAR) 
VALUES ('U0008','209',NULL,'Sofía','García','sofiag',TO_DATE('2025-06-11 20:59:41','YYYY-MM-DD HH24:MI:SS'),'sofia@mail.com','3108888888');

INSERT INTO "USER" (CONSECUSER,CODUBICA,USE_CONSECUSER,NOMBRE,APELLIDO,"USER",FECHAREGISTRO,EMAIL,CELULAR) 
VALUES ('U0009','57',NULL,'Jorge','Vargas','jorgev',TO_DATE('2025-06-12 20:59:41','YYYY-MM-DD HH24:MI:SS'),'jorge@mail.com','3109999999');

INSERT INTO "USER" (CONSECUSER,CODUBICA,USE_CONSECUSER,NOMBRE,APELLIDO,"USER",FECHAREGISTRO,EMAIL,CELULAR) 
VALUES ('U0010','1',NULL,'Luisa','Fernández','luisaf',TO_DATE('2025-06-13 20:59:41','YYYY-MM-DD HH24:MI:SS'),'luisa@mail.com','3100000000');

-- AMIG_
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0001','U0002');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0001','U0004');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0001','U0005');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0002','U0001');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0002','U0004');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0002','U0005');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0003','U0004');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0003','U0006');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0003','U0007');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0004','U0001');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0004','U0002');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0004','U0003');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0005','U0001');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0005','U0002');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0005','U0006');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0006','U0003');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0006','U0005');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0006','U0007');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0007','U0003');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0007','U0006');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0007','U0008');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0008','U0007');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0008','U0009');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0008','U0010');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0009','U0004');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0009','U0008');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0009','U0010');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0010','U0005');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0010','U0008');
INSERT INTO AMIG_ (CONSECUSER,USE_CONSECUSER) VALUES ('U0010','U0009');

-- GRUPO
INSERT INTO GRUPO (CODGRUPO,CONSECUSER,GRU_CODGRUPO,NOMGRUPO,FECHAREGGRUPO, IMAGGRUPO) 
VALUES (1001,'U0001',NULL,'Programadores Java',TO_DATE('2025-06-14 20:59:41','YYYY-MM-DD HH24:MI:SS'), EMPTY_BLOB());
INSERT INTO GRUPO (CODGRUPO,CONSECUSER,GRU_CODGRUPO,NOMGRUPO,FECHAREGGRUPO, IMAGGRUPO) 
VALUES (1002,'U0002',NULL,'Amantes Música',TO_DATE('2025-06-19 20:59:41','YYYY-MM-DD HH24:MI:SS'), EMPTY_BLOB());
INSERT INTO GRUPO (CODGRUPO,CONSECUSER,GRU_CODGRUPO,NOMGRUPO,FECHAREGGRUPO, IMAGGRUPO) 
VALUES (1003,'U0004',NULL,'Viajeros',TO_DATE('2025-06-24 20:59:41','YYYY-MM-DD HH24:MI:SS'), EMPTY_BLOB());

-- PERTENECE
INSERT INTO PERTENECE (CODGRUPO,CONSECUSER) VALUES (1001,'U0001');
INSERT INTO PERTENECE (CODGRUPO,CONSECUSER) VALUES (1001,'U0002');
INSERT INTO PERTENECE (CODGRUPO,CONSECUSER) VALUES (1001,'U0004');
INSERT INTO PERTENECE (CODGRUPO,CONSECUSER) VALUES (1001,'U0005');
INSERT INTO PERTENECE (CODGRUPO,CONSECUSER) VALUES (1001,'U0006');
INSERT INTO PERTENECE (CODGRUPO,CONSECUSER) VALUES (1001,'U0007');
INSERT INTO PERTENECE (CODGRUPO,CONSECUSER) VALUES (1002,'U0001');
INSERT INTO PERTENECE (CODGRUPO,CONSECUSER) VALUES (1002,'U0002');
INSERT INTO PERTENECE (CODGRUPO,CONSECUSER) VALUES (1002,'U0004');
INSERT INTO PERTENECE (CODGRUPO,CONSECUSER) VALUES (1002,'U0006');
INSERT INTO PERTENECE (CODGRUPO,CONSECUSER) VALUES (1002,'U0008');
INSERT INTO PERTENECE (CODGRUPO,CONSECUSER) VALUES (1002,'U0010');
INSERT INTO PERTENECE (CODGRUPO,CONSECUSER) VALUES (1003,'U0002');
INSERT INTO PERTENECE (CODGRUPO,CONSECUSER) VALUES (1003,'U0003');
INSERT INTO PERTENECE (CODGRUPO,CONSECUSER) VALUES (1003,'U0004');
INSERT INTO PERTENECE (CODGRUPO,CONSECUSER) VALUES (1003,'U0005');
INSERT INTO PERTENECE (CODGRUPO,CONSECUSER) VALUES (1003,'U0007');
INSERT INTO PERTENECE (CODGRUPO,CONSECUSER) VALUES (1003,'U0009');

-- MENSAJE
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0001','U0001',1,1001,NULL,NULL,NULL,TO_DATE('2025-06-18 19:51:10','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0002','U0002',2,1001,NULL,NULL,NULL,TO_DATE('2025-06-22 04:44:06','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0003','U0003',3,1001,NULL,NULL,NULL,TO_DATE('2025-06-13 15:13:03','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0004','U0004',4,1001,NULL,NULL,NULL,TO_DATE('2025-06-16 16:21:14','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0005','U0005',5,1001,NULL,NULL,NULL,TO_DATE('2025-06-10 19:38:25','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0006','U0006',6,1001,NULL,NULL,NULL,TO_DATE('2025-06-07 11:40:32','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0001','U0001',7,1001,NULL,NULL,NULL,TO_DATE('2025-06-25 11:33:43','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0002','U0002',8,1001,NULL,NULL,NULL,TO_DATE('2025-06-23 14:57:37','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0004','U0004',9,1001,NULL,NULL,NULL,TO_DATE('2025-06-30 22:31:17','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0005','U0005',10,1001,NULL,NULL,NULL,TO_DATE('2025-06-21 11:34:40','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0002','U0002',13,1001,NULL,NULL,NULL,TO_DATE('2025-06-30 12:22:04','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0003','U0003',14,1001,NULL,NULL,NULL,TO_DATE('2025-07-02 12:10:59','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0002','U0002',1,1002,NULL,NULL,NULL,TO_DATE('2025-06-10 07:59:46','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0004','U0004',2,1002,NULL,NULL,NULL,TO_DATE('2025-06-15 23:36:07','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0006','U0006',3,1002,NULL,NULL,NULL,TO_DATE('2025-06-16 06:51:50','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0008','U0008',4,1002,NULL,NULL,NULL,TO_DATE('2025-06-13 03:11:43','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0010','U0010',5,1002,NULL,NULL,NULL,TO_DATE('2025-07-02 16:44:16','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0001','U0001',6,1002,NULL,NULL,NULL,TO_DATE('2025-06-28 01:46:14','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0002','U0002',7,1002,NULL,NULL,NULL,TO_DATE('2025-06-06 06:40:04','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0004','U0004',8,1002,NULL,NULL,NULL,TO_DATE('2025-06-23 18:43:20','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0006','U0006',9,1002,NULL,NULL,NULL,TO_DATE('2025-06-23 22:41:03','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0008','U0008',10,1002,NULL,NULL,NULL,TO_DATE('2025-06-30 08:19:54','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0004','U0004',13,1002,NULL,NULL,NULL,TO_DATE('2025-06-15 07:55:41','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0006','U0006',14,1002,NULL,NULL,NULL,TO_DATE('2025-06-18 14:24:21','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0004','U0004',1,1003,NULL,NULL,NULL,TO_DATE('2025-06-15 08:27:02','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0005','U0005',2,1003,NULL,NULL,NULL,TO_DATE('2025-06-14 17:32:12','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0007','U0007',3,1003,NULL,NULL,NULL,TO_DATE('2025-06-29 09:31:09','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0009','U0009',4,1003,NULL,NULL,NULL,TO_DATE('2025-06-05 22:13:14','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0002','U0002',5,1003,NULL,NULL,NULL,TO_DATE('2025-06-05 00:53:44','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0003','U0003',6,1003,NULL,NULL,NULL,TO_DATE('2025-06-23 17:28:42','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0004','U0004',7,1003,NULL,NULL,NULL,TO_DATE('2025-06-17 08:24:34','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0005','U0005',8,1003,NULL,NULL,NULL,TO_DATE('2025-06-25 14:39:16','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0007','U0007',9,1003,NULL,NULL,NULL,TO_DATE('2025-06-08 00:11:38','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0009','U0009',10,1003,NULL,NULL,NULL,TO_DATE('2025-06-05 09:12:02','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0005','U0005',11,1003,NULL,NULL,NULL,TO_DATE('2025-06-24 18:35:55','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0007','U0007',12,1003,NULL,NULL,NULL,TO_DATE('2025-06-04 21:26:24','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0001','U0005',1,NULL,NULL,NULL,NULL,TO_DATE('2025-07-04 21:23:01','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0001','U0002',1,NULL,NULL,NULL,NULL,TO_DATE('2025-07-04 21:25:45','YYYY-MM-DD HH24:MI:SS'));
INSERT INTO MENSAJE (CONSECUSER,USE_CONSECUSER,CONSMENSAJE,CODGRUPO,MEN_CONSECUSER, MEN_USE_CONSECUSER,MEN_CONSMENSAJE,FECHAREGMEN) VALUES ('U0001','U0004',1,NULL,NULL,NULL,NULL,TO_DATE('2025-07-04 21:27:04','YYYY-MM-DD HH24:MI:SS'));

-- CONTENIDO
INSERT INTO CONTENIDO (CONSECUSER, USE_CONSECUSER, CONSMENSAJE, CONSECONTENIDO, IDTIPOCONTENIDO, IDTIPOARCHIVO, CONTENIDOIMAG, LOCALIZACONTENIDO)
VALUES ('U0001','U0001',1,1,'2',NULL,EMPTY_BLOB(),'Hola grupo 1001');

INSERT INTO CONTENIDO (CONSECUSER, USE_CONSECUSER, CONSMENSAJE, CONSECONTENIDO, IDTIPOCONTENIDO, IDTIPOARCHIVO, CONTENIDOIMAG, LOCALIZACONTENIDO)
VALUES ('U0002','U0002',2,1,'1','4',EMPTY_BLOB(),'grupo1001_img.gif');

INSERT INTO CONTENIDO (CONSECUSER, USE_CONSECUSER, CONSMENSAJE, CONSECONTENIDO, IDTIPOCONTENIDO, IDTIPOARCHIVO, CONTENIDOIMAG, LOCALIZACONTENIDO)
VALUES ('U0003','U0003',3,1,'5','1',EMPTY_BLOB(),'grupo1001_doc.pdf');

INSERT INTO CONTENIDO VALUES ('U0004','U0004',4,1,'2',NULL,EMPTY_BLOB(),'Re: hola');

INSERT INTO CONTENIDO VALUES ('U0005','U0005',5,1,'2',NULL,EMPTY_BLOB(),'Tambén saludo');

INSERT INTO CONTENIDO VALUES ('U0006','U0006',6,1,'2',NULL,EMPTY_BLOB(),'Hola hola');

INSERT INTO CONTENIDO VALUES ('U0001','U0001',7,1,'2',NULL,EMPTY_BLOB(),'¨Cómo están?');

INSERT INTO CONTENIDO VALUES ('U0002','U0002',8,1,'2',NULL,EMPTY_BLOB(),'Todo bien');

INSERT INTO CONTENIDO VALUES ('U0004','U0004',9,1,'2',NULL,EMPTY_BLOB(),'Listos para programar');

INSERT INTO CONTENIDO VALUES ('U0005','U0005',10,1,'2',NULL,EMPTY_BLOB(),'Vamos con todo');

INSERT INTO CONTENIDO VALUES ('U0002','U0002',13,1,'1','1',EMPTY_BLOB(),'grupo1001_img2.gif');

INSERT INTO CONTENIDO VALUES ('U0003','U0003',14,1,'5','1',EMPTY_BLOB(),'grupo1001_doc2.pdf');

INSERT INTO CONTENIDO VALUES ('U0002','U0002',1,1,'2',NULL,EMPTY_BLOB(),'Hola grupo 1002');

INSERT INTO CONTENIDO VALUES ('U0004','U0004',2,1,'1','4',EMPTY_BLOB(),'grupo1002_img.gif');

INSERT INTO CONTENIDO VALUES ('U0006','U0006',3,1,'5','2',EMPTY_BLOB(),'grupo1002_doc.doc');

INSERT INTO CONTENIDO VALUES ('U0008','U0008',4,1,'2',NULL,EMPTY_BLOB(),'Gracias por el saludo');

INSERT INTO CONTENIDO VALUES ('U0010','U0010',5,1,'2',NULL,EMPTY_BLOB(),'Yo también');

INSERT INTO CONTENIDO VALUES ('U0001','U0001',6,1,'2',NULL,EMPTY_BLOB(),'Hola de nuevo');

INSERT INTO CONTENIDO VALUES ('U0002','U0002',7,1,'2',NULL,EMPTY_BLOB(),'Hoy ensayamos');

INSERT INTO CONTENIDO VALUES ('U0004','U0004',8,1,'2',NULL,EMPTY_BLOB(),'Claro');

INSERT INTO CONTENIDO VALUES ('U0006','U0006',9,1,'2',NULL,EMPTY_BLOB(),'­Vamos!');

INSERT INTO CONTENIDO VALUES ('U0008','U0008',10,1,'2',NULL,EMPTY_BLOB(),'Hasta mañana');

INSERT INTO CONTENIDO VALUES ('U0004','U0004',13,1,'1','4',EMPTY_BLOB(),'grupo1002_img2.gif');

INSERT INTO CONTENIDO VALUES ('U0006','U0006',14,1,'5','1',EMPTY_BLOB(),'grupo1002_doc2.pdf');

INSERT INTO CONTENIDO VALUES ('U0004','U0004',1,1,'2',NULL,EMPTY_BLOB(),'¨Listos para el viaje a Medellín?');

INSERT INTO CONTENIDO VALUES ('U0005','U0005',2,1,'1','4',EMPTY_BLOB(),'grupo1003_meme.gif');

INSERT INTO CONTENIDO VALUES ('U0007','U0007',3,1,'5','2',EMPTY_BLOB(),'grupo1003_ruta.doc');

INSERT INTO CONTENIDO VALUES ('U0009','U0009',4,1,'2',NULL,EMPTY_BLOB(),'Sí, hola');

INSERT INTO CONTENIDO VALUES ('U0002','U0002',5,1,'2',NULL,EMPTY_BLOB(),'Buenos días');

INSERT INTO CONTENIDO VALUES ('U0003','U0003',6,1,'2',NULL,EMPTY_BLOB(),'­Hola a todos!');

INSERT INTO CONTENIDO VALUES ('U0004','U0004',7,1,'2',NULL,EMPTY_BLOB(),'Reunión mañana');

INSERT INTO CONTENIDO VALUES ('U0005','U0005',8,1,'2',NULL,EMPTY_BLOB(),'Ok');

INSERT INTO CONTENIDO VALUES ('U0007','U0007',9,1,'2',NULL,EMPTY_BLOB(),'Confirmado');

INSERT INTO CONTENIDO VALUES ('U0009','U0009',10,1,'2',NULL,EMPTY_BLOB(),'Listo equipo');

INSERT INTO CONTENIDO VALUES ('U0005','U0005',11,1,'1','4',EMPTY_BLOB(),'grupo1003_meme2.gif');

INSERT INTO CONTENIDO VALUES ('U0007','U0007',12,1,'5','1',EMPTY_BLOB(),'grupo1003_doc.pdf');
