const url = require('url');
const db = require('../conecction/mysql');
const crypto = require('crypto');
const util = require('util');
const query = util.promisify(db.query).bind(db);
const { bodyParser } = require('../lib/bodyParse');
const { ValidarProblema } = require('../models/problemas');
const { ExisteUsuario } = require('./usuarios');
const { ExisteEstado } = require('./validaciones');

//clave de encriptacion
const SECRET = require('../config');
const claveSecret = SECRET.CLAVE_ENCRIPTADO;

const CrearProblema = async (req, res) => {
    try {
        await bodyParser(req);
        const nuevoProblema = req.body;
        const userId = req.usuario.idUsuario;
        
        // console.log(req.body)
        // console.log(userId)
        const userExists = await ExisteUsuario(userId);

        if (!userExists) {
            sendResponse(res, 404, 'application/json', 'El usuario con user_id no existe');
            return;
        }

        const problemasExistentes = await getProblemasExistentes(req, res);
        const validationResult = await ValidarProblema(nuevoProblema, problemasExistentes);
        
        if (!validationResult.isValid) {
            sendResponse(res, 400, 'application/json', JSON.stringify({ error: validationResult.error }));
            return;
        }

        const query = 'INSERT INTO problema(ID_problema, direccion, fecha, ID_gravedad, ID_tipo, ID_usuario, ID_municipio, ID_estado) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';

        const values = [
            nuevoProblema.ID_problema,
            nuevoProblema.direccion,
            new Date().toLocaleDateString("en-US"),
            nuevoProblema.ID_gravedad,
            nuevoProblema.ID_tipo,
            userId,
            nuevoProblema.ID_municipio,
            '1'
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                handleServerError(res, err);
            } else {
                sendResponse(res, 200, 'application/json', JSON.stringify('Problema Creado exitosamente'));
            }
        });
    } catch (err) {
        handleServerError(res, err);
    }
};

const updateProblema = async (req, res) => {
    try {
        await bodyParser(req);
        const problema = req.body;
        const userId = req.usuario.idUsuario;
        
        // console.log(req.body)
        // console.log(userId)
        const userExists = await ExisteUsuario(userId);

        if (!userExists) {
            sendResponse(res, 404, 'application/json', 'El usuario con user_id no existe');
            return;
        }

        const problemasExistentes = await getProblemasExistentes(req, res);
        const validationResult = await ValidarProblema(problema, problemasExistentes, 'U');

        if (!validationResult.isValid) {
            sendResponse(res, 400, 'application/json', JSON.stringify({ error: validationResult.error }));
            return;
        }

        const query = 'UPDATE problema SET direccion = ?, ID_gravedad = ?, ID_tipo = ?, ID_municipio = ? WHERE ID_problema = ?';

        const values = [
            problema.direccion,
            problema.ID_gravedad,
            problema.ID_tipo,
            problema.ID_municipio,
            problema.ID_problema
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                handleServerError(res, err);
            } else {
                sendResponse(res, 200, 'application/json', JSON.stringify('Problema actualizado exitosamente'));
            }
        });
    } catch (err) {
        handleServerError(res, err);
    }
};


const actualizaEstadoUsuario = async (req, res) => {
    try {
        await bodyParser(req);
        const problema = req.body;
        const userId = req.usuario.idUsuario;
        const validEstados = ['2', '3', '4'];
        const validEstadosUsu = ['3', '4'];
        
        // console.log(req.body)
        // console.log(userId)
        const userExists = await ExisteUsuario(userId);

        if (!userExists) {
            sendResponse(res, 404, 'application/json', 'El usuario con user_id no existe');
            return;
        }

        const problemaExistente = await validaProblemaExistente(req, res, problema.ID_problema);

        if (!problemaExistente) {
            sendResponse(res, 404, 'application/json', 'El id Problema no existe');
            return;
        }

        if (!validEstados.includes(problema.ID_estado)) {
            sendResponse(res, 400, 'application/json', 'Estado no valido');
            return;
        }
        else{
            const problemaDB = await getProblemaDetalle(req, res, problema.ID_problema)
            
            if(problemaDB[0].ID_Usuario == userId && !validEstadosUsu.includes(problema.ID_estado)){
                sendResponse(res, 400, 'application/json', 'Estado no permitido');
                return;
            }

            if(problemaDB[0].ID_estado == 3){
                sendResponse(res, 400, 'application/json', 'Problema ya eliminado');
                return;
            }
        }

        const query = 'UPDATE problema SET ID_ESTADO = ? WHERE ID_problema = ?';

        const values = [
            problema.ID_estado,
            problema.ID_problema
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                handleServerError(res, err);
            } else {
                sendResponse(res, 200, 'application/json', JSON.stringify('Estado actualizado exitosamente'));
            }
        });
    } catch (err) {
        handleServerError(res, err);
    }
};

const actualizarEstadoProblema = async (req, res) => {
    try {
        await bodyParser(req);
        const problema = req.body;
        const userId = req.usuario.idUsuario;
        const userExists = await ExisteUsuario(userId);

        if (!userExists) {
            sendResponse(res, 404, 'application/json', 'El usuario con user_id no existe');
            return;
        }

        const problemaExistente = await validaProblemaExistente(req, res, problema.ID_problema);

        if (!problemaExistente) {
            sendResponse(res, 404, 'application/json', 'El id Problema no existe');
            return;
        }

        const validaEstado = await ExisteEstado(problema.ID_estado);

        if (!validaEstado) {
            sendResponse(res, 404, 'application/json', 'El id Estado no existe');
            return;
        }

        const problemaDB = await getProblemaDetalle(req, res, problema.ID_problema)
        if(problemaDB[0].ID_estado == 3){
            sendResponse(res, 404, 'application/json', 'Problema ya eliminado');
            return;
        }

        var query = 'UPDATE problema SET ID_ESTADO = ? WHERE ID_problema = ?';

        const values = [
            problema.ID_estado,
            problema.ID_problema
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                handleServerError(res, err);
            } else {
                if(problema.ID_estado != "3"){
                    sendResponse(res, 200, 'application/json', JSON.stringify('Estado actualizado exitosamente'));;
                    return;
                }


                query = 'UPDATE usuario SET borrados = IFNULL(borrados, 0) + 1 WHERE ID_Usuario = ?';
                db.query(query, userId, (err, result) => {
                    if (err) {
                        handleServerError(res, err);
                    } else {
                        query = 'UPDATE usuario SET denuncia_real = IFNULL(denuncia_real, 0) + 1 WHERE ID_Usuario = ?';
                        db.query(query, problemaDB[0].ID_Usuario, (err, result) => {
                            if (err) {
                                handleServerError(res, err);
                            } else {
                                sendResponse(res, 200, 'application/json', JSON.stringify('Estado actualizado exitosamente'));
                            }
                        });
                    }
                });
            }
        });
    } catch (err) {
        handleServerError(res, err);
    }
};

const getAllProblemas = async (req, res) => {
    try {
        const sql = `SELECT ID_problema, direccion, p.fecha, g.nombre 'ID_gravedad', t.nombre 'ID_tipo', p.ID_Usuario, m.Nombre 'ID_municipio', e.Nombre 'ID_estado'
                FROM problema p
                    INNER JOIN gravedad g   on p.ID_gravedad    = g.ID_gravedad
                    INNER JOIN Tipo t       on p.ID_tipo        = t.ID_tipo
                    INNER JOIN Municipio m  on p.ID_municipio   = m.ID_municipio 
                    INNER JOIN Estado e     on p.ID_estado      = e.ID_estado
                WHERE p.ID_estado != 3;`;
        const problemas = await query(sql);

        if (problemas.length > 0) {
            sendResponse(res, 200, 'application/json', JSON.stringify(problemas));
        } else {
            sendResponse(res, 404, 'application/json', 'Sin problemas creados');
        }
    } catch (err) {
        handleServerError(res, err);
    }
};

//verificar que no se repita el id
const getProblemasExistentes = async (req, res) => {
    try {
        const sql = 'SELECT * FROM problema';
        const results = await query(sql);
        return results;
    } catch (err) {
        handleServerError(res, err);
    }
};

const getProblemaDetalle = async (req, res, id) => {
    try {
        const sql = 'SELECT ID_Usuario, ID_estado FROM problema WHERE ID_Problema = ?';
        const results = await query(sql, id);
        return results;
    } catch (err) {
        handleServerError(res, err);
    }
};

//verificar que no se repita el id
const validaProblemaExistente = async (req, res, id) => {
    try {
        const sql = 'SELECT * FROM problema WHERE ID_problema = ?';
        const results = await query(sql, id);
        return results.length > 0;
    } catch (err) {
        handleServerError(res, err);
    }
};

const sendResponse = (res, status, contentType, body) => {
    res.writeHead(status, { 'Content-Type': contentType });
    res.end(body);
};

const handleServerError = (res, error) => {
    console.error(error);
    sendResponse(res, 500, 'application/json', 'Error interno del servidor');
};

module.exports = { CrearProblema, getAllProblemas, updateProblema, actualizaEstadoUsuario, actualizarEstadoProblema };