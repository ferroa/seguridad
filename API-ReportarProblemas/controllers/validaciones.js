const db = require('../conecction/mysql');
const util = require('node:util');
const query = util.promisify(db.query).bind(db);

async function ExisteUsuario(Id) {
    const sql = `SELECT ID_usuario FROM usuario WHERE ID_usuario = '${userId}'`;
    const result = await query(sql);
    return result.length > 0 ;
};

async function ExisteGravedad(Id) {
    const sql = `SELECT ID_gravedad FROM gravedad WHERE ID_gravedad = '${Id}'`;
    const result = await query(sql);
    return result.length > 0 ;
};

async function ExisteTipo(Id) {
    const sql = `SELECT ID_tipo FROM Tipo WHERE ID_tipo = '${Id}'`;
    const result = await query(sql);
    return result.length > 0 ;
};

async function ExisteMunicipio(Id) {
    const sql = `SELECT ID_municipio FROM Municipio WHERE ID_municipio = '${Id}'`;
    const result = await query(sql);
    return result.length > 0 ;
};

async function ExisteEstado(Id) {
    const sql = `SELECT ID_estado FROM Estado WHERE ID_estado = '${Id}'`;
    const result = await query(sql);
    return result.length > 0 ;
};

module.exports = { ExisteUsuario, ExisteGravedad, ExisteTipo, ExisteMunicipio, ExisteEstado };