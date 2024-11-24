CREATE DATABASE ReportarProblema;

use ReportarProblema;
CREATE TABLE role (
	ID_role VARCHAR(64) PRIMARY KEY NOT NULL,
	nombre VARCHAR(32) NOT NULL
);

SELECT * FROM role;

INSERT INTO ROLE values('usuario', 'Usuario');
INSERT INTO ROLE values('Admin', 'Admin');
INSERT INTO ROLE values('SuperAdmin', 'SuperAdmin');

CREATE TABLE gravedad (
	ID_gravedad VARCHAR(64) PRIMARY KEY NOT NULL,
	nombre VARCHAR(32) NOT NULL
);

SELECT * FROM gravedad;

INSERT INTO GRAVEDAD VALUES(1, 'LEVE');
INSERT INTO GRAVEDAD VALUES(2, 'MODERADO');
INSERT INTO GRAVEDAD VALUES(3, 'PELIGROSO');

CREATE TABLE estado (
	ID_estado VARCHAR(64) PRIMARY KEY NOT NULL,
	nombre VARCHAR(32) NOT NULL
);

INSERT INTO ESTADO VALUES(1, 'ACTIVO');
INSERT INTO ESTADO VALUES(2, 'DENUNCIADO');
INSERT INTO ESTADO VALUES(3, 'ELIMINADO');
INSERT INTO ESTADO VALUES(4, 'SOLUCIONADO');

CREATE TABLE municipio (
	ID_municipio VARCHAR(64) PRIMARY KEY NOT NULL,
	nombre VARCHAR(64) NOT NULL
);

INSERT INTO MUNICIPIO VALUES(1, 'SAN SALVADOR');
INSERT INTO MUNICIPIO VALUES(2, 'SAN MARCOS');
INSERT INTO MUNICIPIO VALUES(3, 'SAN JACINTO');

CREATE TABLE tipo (
	ID_tipo VARCHAR(64) PRIMARY KEY NOT NULL,
	nombre VARCHAR(32) NOT NULL
);

INSERT INTO TIPO VALUES(1, 'BACHE');
INSERT INTO TIPO VALUES(2, 'PELIGRO');

SET FOREIGN_KEY_CHECKS = 0; 
DROP TABLE usuario; 
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE usuario (
	ID_usuario VARCHAR(64) NOT NULL PRIMARY KEY,
	nombre VARCHAR(64) NOT NULL,
	correo VARCHAR(64) NOT NULL,
	password VARCHAR(64) NOT NULL,
	ID_municipio VARCHAR(64) NOT NULL,
	ID_role VARCHAR(64) NOT NULL,
	fecha_creacion VARCHAR(16) NOT NULL,
	denuncia_real INT,
	borrados INT,
	user_borados INT,
	FOREIGN KEY (ID_municipio) REFERENCES municipio(ID_municipio),
	FOREIGN KEY (ID_role) REFERENCES role(ID_role)
);
INSERT INTO usuario(ID_usuario, nombre, correo, password, ID_municipio, ID_role, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, ?);

SELECT * FROM usuario;

SELECT ID_Usuario, u.nombre, correo, m.nombre 'Municipio', ID_Role 'Role', fecha_creacion, denuncia_real, (SELECT COUNT(1) FROM problema p WHERE p.ID_Usuario = u.ID_Usuario) 'total_Problemas'
FROM usuario u
	INNER JOIN municipio m on u.ID_municipio = m.ID_municipio
WHERE ID_Role = 'usuario';

DELETE FROM problema WHERE ID_usuario = ?; DELETE FROM Usuario WHERE ID_usuario = ?;

UPDATE Usuario
	SET ID_ROLE = 'superadmin'
    WHERE ID_USUARIO = 'AcvdoFinal1';

CREATE TABLE problema (
	ID_problema VARCHAR(64) NOT NULL PRIMARY KEY,
	direccion VARCHAR(128) NOT NULL,
	fecha VARCHAR(16) NOT NULL,
	ID_gravedad VARCHAR(64) NOT NULL,
	ID_tipo VARCHAR(64) NOT NULL,
	ID_usuario VARCHAR(64) NOT NULL,
	ID_municipio VARCHAR(64) NOT NULL,
	ID_estado VARCHAR(64) NOT NULL,
	FOREIGN KEY (ID_gravedad) REFERENCES gravedad(ID_gravedad),
	FOREIGN KEY (ID_tipo) REFERENCES tipo(ID_tipo),
	FOREIGN KEY (ID_usuario) REFERENCES usuario(ID_usuario),
	FOREIGN KEY (ID_municipio) REFERENCES municipio(ID_municipio),
	FOREIGN KEY (ID_estado) REFERENCES estado(ID_estado)
);
SELECT * FROM problema;

SELECT * FROM usuario;

SELECT ID_problema, direccion, p.fecha, g.nombre 'ID_gravedad', t.nombre 'ID_tipo', p.ID_Usuario, m.Nombre 'ID_municipio', e.Nombre 'ID_estado'
FROM problema p
	INNER JOIN gravedad g on p.ID_gravedad = g.ID_gravedad
    INNER JOIN Tipo t on p.ID_tipo = t.ID_tipo
    INNER JOIN Municipio m on p.ID_municipio = m.ID_municipio 
    INNER JOIN Estado e on p.ID_estado = e.ID_estado;
WHERE p.ID_estado != 3;

UPDATE problema
SET direccion = ?,
	ID_gravedad = ?, 
	ID_tipo = ?, 
	ID_municipio = ? 
WHERE ID_problema = ?

INSERT INTO problema(ID_problema, direccion, fecha, ID_gravedad, ID_tipo, ID_usuario, ID_municipio, ID_estado)
VALUES(?, ?, ?, ?, ?, ?, ?, ?)

