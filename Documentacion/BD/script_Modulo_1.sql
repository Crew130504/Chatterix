/*==============================================================*/
/* DBMS name:      ORACLE Version 11g                           */
/* Created on:     26/06/2025 10:39:04 p.�m.                    */
/*==============================================================*/



/*==============================================================*/
/* Table: AMIG_                                                 */
/*==============================================================*/
create table AMIG_ 
(
   CONSECUSER           VARCHAR2(5)          not null,
   USE_CONSECUSER       VARCHAR2(5)          not null,
   constraint PK_AMIG_ primary key (CONSECUSER, USE_CONSECUSER)
);

/*==============================================================*/
/* Index: AMIG__FK                                              */
/*==============================================================*/
create index AMIG__FK on AMIG_ (
   CONSECUSER ASC
);

/*==============================================================*/
/* Index: AMIG_2_FK                                             */
/*==============================================================*/
create index AMIG_2_FK on AMIG_ (
   USE_CONSECUSER ASC
);

/*==============================================================*/
/* Table: CONFIGRUPO                                            */
/*==============================================================*/
create table CONFIGRUPO 
(
   CODGRUPO             NUMBER(5,0)          not null,
   NCONFIGRUPO          NUMBER(3,0)          not null,
   IDPROPIEDAD          VARCHAR2(2)          not null,
   ESTADO               SMALLINT             not null,
   constraint PK_CONFIGRUPO primary key (CODGRUPO, NCONFIGRUPO)
);

/*==============================================================*/
/* Index: PROPIGRUPO_FK                                         */
/*==============================================================*/
create index PROPIGRUPO_FK on CONFIGRUPO (
   IDPROPIEDAD ASC
);

/*==============================================================*/
/* Index: GRUPO_FK                                              */
/*==============================================================*/
create index GRUPO_FK on CONFIGRUPO (
   CODGRUPO ASC
);

/*==============================================================*/
/* Table: CONFIUSER                                             */
/*==============================================================*/
create table CONFIUSER 
(
   CONSECUSER           VARCHAR2(5)          not null,
   NCONFIUSER           NUMBER(3,0)          not null,
   IDPROPIEDAD          VARCHAR2(2)          not null,
   ESTADO               SMALLINT,
   VALOR                NUMBER(1,0),
   constraint PK_CONFIUSER primary key (CONSECUSER, NCONFIUSER)
);

/*==============================================================*/
/* Index: USER_FK                                               */
/*==============================================================*/
create index USER_FK on CONFIUSER (
   CONSECUSER ASC
);

/*==============================================================*/
/* Index: PROPIUSER_FK                                          */
/*==============================================================*/
create index PROPIUSER_FK on CONFIUSER (
   IDPROPIEDAD ASC
);

/*==============================================================*/
/* Table: CONTENIDO                                             */
/*==============================================================*/
create table CONTENIDO 
(
   CONSECUSER           VARCHAR2(5)          not null,
   USE_CONSECUSER       VARCHAR2(5)          not null,
   CONSMENSAJE          NUMBER(5,0)          not null,
   CONSECONTENIDO       NUMBER(2,0)          not null,
   IDTIPOCONTENIDO      VARCHAR2(2)          not null,
   IDTIPOARCHIVO        VARCHAR2(3),
   CONTENIDOIMAG        BLOB                 ,
   LOCALIZACONTENIDO    VARCHAR2(255),
   constraint PK_CONTENIDO primary key (CONSECUSER, USE_CONSECUSER, CONSMENSAJE, CONSECONTENIDO)
);

/*==============================================================*/
/* Index: MENSAJE_FK                                            */
/*==============================================================*/
create index MENSAJE_FK on CONTENIDO (
   CONSECUSER ASC,
   USE_CONSECUSER ASC,
   CONSMENSAJE ASC
);

/*==============================================================*/
/* Index: TIPOCONTE_FK                                          */
/*==============================================================*/
create index TIPOCONTE_FK on CONTENIDO (
   IDTIPOCONTENIDO ASC
);

/*==============================================================*/
/* Index: TIPOARCHIVO_FK                                        */
/*==============================================================*/
create index TIPOARCHIVO_FK on CONTENIDO (
   IDTIPOARCHIVO ASC
);

/*==============================================================*/
/* Table: GRUPO                                                 */
/*==============================================================*/
create table GRUPO 
(
   CODGRUPO             NUMBER(5,0)          not null,
   CONSECUSER           VARCHAR2(5)          ,
   GRU_CODGRUPO         NUMBER(5,0),
   NOMGRUPO             VARCHAR2(30)         not null,
   FECHAREGGRUPO        DATE                 not null,
   IMAGGRUPO            BLOB                 ,
   constraint PK_GRUPO primary key (CODGRUPO)
);

/*==============================================================*/
/* Index: MODIFICAGRUPO_FK                                      */
/*==============================================================*/
create index MODIFICAGRUPO_FK on GRUPO (
   GRU_CODGRUPO ASC
);

/*==============================================================*/
/* Index: CREAADMINISTRA_FK                                     */
/*==============================================================*/
create index CREAADMINISTRA_FK on GRUPO (
   CONSECUSER ASC
);

/*==============================================================*/
/* Table: MENSAJE                                               */
/*==============================================================*/
create table MENSAJE 
(
   CONSECUSER           VARCHAR2(5)          not null,
   USE_CONSECUSER       VARCHAR2(5)          not null,
   CONSMENSAJE          NUMBER(5,0)          not null,
   CODGRUPO             NUMBER(5,0),
   MEN_CONSECUSER       VARCHAR2(5),
   MEN_USE_CONSECUSER   VARCHAR2(5),
   MEN_CONSMENSAJE      NUMBER(5,0),
   FECHAREGMEN          DATE                 not null,
   constraint PK_MENSAJE primary key (CONSECUSER, USE_CONSECUSER, CONSMENSAJE)
);

/*==============================================================*/
/* Index: RECIBE_FK                                             */
/*==============================================================*/
create index RECIBE_FK on MENSAJE (
   CONSECUSER ASC
);

/*==============================================================*/
/* Index: ENVIA_FK                                              */
/*==============================================================*/
create index ENVIA_FK on MENSAJE (
   USE_CONSECUSER ASC
);

/*==============================================================*/
/* Index: GRUPOMENSAJE_FK                                       */
/*==============================================================*/
create index GRUPOMENSAJE_FK on MENSAJE (
   CODGRUPO ASC
);

/*==============================================================*/
/* Index: HILO_FK                                               */
/*==============================================================*/
create index HILO_FK on MENSAJE (
   MEN_CONSECUSER ASC,
   MEN_USE_CONSECUSER ASC,
   MEN_CONSMENSAJE ASC
);

/*==============================================================*/
/* Table: PERTENECE                                             */
/*==============================================================*/
create table PERTENECE 
(
   CODGRUPO             NUMBER(5,0)          not null,
   CONSECUSER           VARCHAR2(5)          not null,
   constraint PK_PERTENECE primary key (CODGRUPO, CONSECUSER)
);

/*==============================================================*/
/* Index: PERTENECE_FK                                          */
/*==============================================================*/
create index PERTENECE_FK on PERTENECE (
   CODGRUPO ASC
);

/*==============================================================*/
/* Index: PERTENECE2_FK                                         */
/*==============================================================*/
create index PERTENECE2_FK on PERTENECE (
   CONSECUSER ASC
);

/*==============================================================*/
/* Table: PROPIEDAD                                             */
/*==============================================================*/
create table PROPIEDAD 
(
   IDPROPIEDAD          VARCHAR2(2)          not null,
   PRO_IDPROPIEDAD      VARCHAR2(2),
   DESCPROPIEDAD        VARCHAR2(100),
   VALORDEFECTO         SMALLINT,
   VALORPROPIEDAD       VARCHAR2(30),
   constraint PK_PROPIEDAD primary key (IDPROPIEDAD)
);

/*==============================================================*/
/* Index: PROPIEDADSUP_FK                                       */
/*==============================================================*/
create index PROPIEDADSUP_FK on PROPIEDAD (
   PRO_IDPROPIEDAD ASC
);

/*==============================================================*/
/* Table: SEGUIR                                                */
/*==============================================================*/
create table SEGUIR 
(
   CONSECUSER           VARCHAR2(5)          not null,
   USE_CONSECUSER       VARCHAR2(5)          not null,
   constraint PK_SEGUIR primary key (CONSECUSER, USE_CONSECUSER)
);

/*==============================================================*/
/* Index: SEGUIR_FK                                             */
/*==============================================================*/
create index SEGUIR_FK on SEGUIR (
   CONSECUSER ASC
);

/*==============================================================*/
/* Index: SEGUIR2_FK                                            */
/*==============================================================*/
create index SEGUIR2_FK on SEGUIR (
   USE_CONSECUSER ASC
);

/*==============================================================*/
/* Table: TIPOARCHIVO                                           */
/*==============================================================*/
create table TIPOARCHIVO 
(
   IDTIPOARCHIVO        VARCHAR2(3)          not null,
   DESCTIPOARCHIVO      VARCHAR2(30)         not null,
   constraint PK_TIPOARCHIVO primary key (IDTIPOARCHIVO)
);

/*==============================================================*/
/* Table: TIPOCONTENIDO                                         */
/*==============================================================*/
create table TIPOCONTENIDO 
(
   IDTIPOCONTENIDO      VARCHAR2(2)          not null,
   DESCTIPOCONTENIDO    VARCHAR2(30)         not null,
   constraint PK_TIPOCONTENIDO primary key (IDTIPOCONTENIDO)
);

/*==============================================================*/
/* Table: TIPOUBICA                                             */
/*==============================================================*/
create table TIPOUBICA 
(
   CODTIPOUBICA         VARCHAR2(3)          not null,
   DESCTIPOUBICA        VARCHAR2(20)         not null,
   constraint PK_TIPOUBICA primary key (CODTIPOUBICA)
);

/*==============================================================*/
/* Table: UBICACION                                             */
/*==============================================================*/
create table UBICACION 
(
   CODUBICA             VARCHAR2(4)          not null,
   UBI_CODUBICA         VARCHAR2(4),
   CODTIPOUBICA         VARCHAR2(3)          not null,
   NOMUBICA             VARCHAR2(30)         not null,
   constraint PK_UBICACION primary key (CODUBICA)
);

/*==============================================================*/
/* Index: TIPOUBICA_FK                                          */
/*==============================================================*/
create index TIPOUBICA_FK on UBICACION (
   CODTIPOUBICA ASC
);

/*==============================================================*/
/* Index: UBICASUP_FK                                           */
/*==============================================================*/
create index UBICASUP_FK on UBICACION (
   UBI_CODUBICA ASC
);

/*==============================================================*/
/* Table: "USER"                                                */
/*==============================================================*/
create table "USER" 
(
   CONSECUSER           VARCHAR2(5)          not null,
   CODUBICA             VARCHAR2(4)          not null,
   USE_CONSECUSER       VARCHAR2(5),
   NOMBRE               VARCHAR2(25)         not null,
   APELLIDO             VARCHAR2(25)         not null,
   "USER"               VARCHAR2(6)          not null,
   FECHAREGISTRO        DATE                 not null,
   EMAIL                VARCHAR2(50)         not null,
   CELULAR              VARCHAR2(16)         not null,
   IMAGEUSER            BLOB,
   TEMAUSER             BLOB,
   HUELLAUSER           BLOB,
   constraint PK_USER primary key (CONSECUSER)
);

/*==============================================================*/
/* Index: UBICA_FK                                              */
/*==============================================================*/
create index UBICA_FK on "USER" (
   CODUBICA ASC
);

/*==============================================================*/
/* Index: ACTUALIZARPERFIL_FK                                   */
/*==============================================================*/
create index ACTUALIZARPERFIL_FK on "USER" (
   USE_CONSECUSER ASC
);

alter table AMIG_
   add constraint FK_AMIG__AMIG__USER foreign key (CONSECUSER)
      references "USER" (CONSECUSER);

alter table AMIG_
   add constraint FK_AMIG__AMIG_2_USER foreign key (USE_CONSECUSER)
      references "USER" (CONSECUSER);

alter table CONFIGRUPO
   add constraint FK_CONFIGRU_GRUPO_GRUPO foreign key (CODGRUPO)
      references GRUPO (CODGRUPO);

alter table CONFIGRUPO
   add constraint FK_CONFIGRU_PROPIGRUP_PROPIEDA foreign key (IDPROPIEDAD)
      references PROPIEDAD (IDPROPIEDAD);

alter table CONFIUSER
   add constraint FK_CONFIUSE_PROPIUSER_PROPIEDA foreign key (IDPROPIEDAD)
      references PROPIEDAD (IDPROPIEDAD);

alter table CONFIUSER
   add constraint FK_CONFIUSE_USER_USER foreign key (CONSECUSER)
      references "USER" (CONSECUSER);

alter table CONTENIDO
   add constraint FK_CONTENID_MENSAJE_MENSAJE foreign key (CONSECUSER, USE_CONSECUSER, CONSMENSAJE)
      references MENSAJE (CONSECUSER, USE_CONSECUSER, CONSMENSAJE);

alter table CONTENIDO
   add constraint FK_CONTENID_TIPOARCHI_TIPOARCH foreign key (IDTIPOARCHIVO)
      references TIPOARCHIVO (IDTIPOARCHIVO);

alter table CONTENIDO
   add constraint FK_CONTENID_TIPOCONTE_TIPOCONT foreign key (IDTIPOCONTENIDO)
      references TIPOCONTENIDO (IDTIPOCONTENIDO);

alter table GRUPO
   add constraint FK_GRUPO_CREAADMIN_USER foreign key (CONSECUSER)
      references "USER" (CONSECUSER);

alter table GRUPO
   add constraint FK_GRUPO_MODIFICAG_GRUPO foreign key (GRU_CODGRUPO)
      references GRUPO (CODGRUPO);

alter table MENSAJE
   add constraint FK_MENSAJE_ENVIA_USER foreign key (USE_CONSECUSER)
      references "USER" (CONSECUSER);

alter table MENSAJE
   add constraint FK_MENSAJE_GRUPOMENS_GRUPO foreign key (CODGRUPO)
      references GRUPO (CODGRUPO);

alter table MENSAJE
   add constraint FK_MENSAJE_HILO_MENSAJE foreign key (MEN_CONSECUSER, MEN_USE_CONSECUSER, MEN_CONSMENSAJE)
      references MENSAJE (CONSECUSER, USE_CONSECUSER, CONSMENSAJE);

alter table MENSAJE
   add constraint FK_MENSAJE_RECIBE_USER foreign key (CONSECUSER)
      references "USER" (CONSECUSER);

alter table PERTENECE
   add constraint FK_PERTENEC_PERTENECE_GRUPO foreign key (CODGRUPO)
      references GRUPO (CODGRUPO);

alter table PERTENECE
   add constraint FK_PERTENEC_PERTENECE_USER foreign key (CONSECUSER)
      references "USER" (CONSECUSER);

alter table PROPIEDAD
   add constraint FK_PROPIEDA_PROPIEDAD_PROPIEDA foreign key (PRO_IDPROPIEDAD)
      references PROPIEDAD (IDPROPIEDAD);

alter table SEGUIR
   add constraint FK_SEGUIR_SEGUIR_USER foreign key (CONSECUSER)
      references "USER" (CONSECUSER);

alter table SEGUIR
   add constraint FK_SEGUIR_SEGUIR2_USER foreign key (USE_CONSECUSER)
      references "USER" (CONSECUSER);

alter table UBICACION
   add constraint FK_UBICACIO_TIPOUBICA_TIPOUBIC foreign key (CODTIPOUBICA)
      references TIPOUBICA (CODTIPOUBICA);

alter table UBICACION
   add constraint FK_UBICACIO_UBICASUP_UBICACIO foreign key (UBI_CODUBICA)
      references UBICACION (CODUBICA);

alter table "USER"
   add constraint FK_USER_ACTUALIZA_USER foreign key (USE_CONSECUSER)
      references "USER" (CONSECUSER);

alter table "USER"
   add constraint FK_USER_UBICA_UBICACIO foreign key (CODUBICA)
      references UBICACION (CODUBICA);

COMMIT;
