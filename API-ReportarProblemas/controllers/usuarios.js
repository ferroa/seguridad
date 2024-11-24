const db = require('../conecction/mysql');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const url = require('node:url');
const util = require('node:util');
const query = util.promisify(db.query).bind(db);
const { bodyParser } = require('../lib/bodyParse');
const { ValidarUsuario } = require('../models/usuarios');

const SECRET = require('../config');
const { Console } = require('console');
const jwt = require('jsonwebtoken');
//para token
const secretKey = SECRET.SECRETKEY;

//para encriptado
const claveSecret = SECRET.CLAVE_ENCRIPTADO;

//validacion de usuario existente para crear uno nuevo
const getUsuariosExistentes = async (req, res) => {

    try {
        const sql = 'SELECT * FROM usuario';
        const results = await query(sql);

        return results.map(usuario => {
            const encryptedEmail = usuario.correo;
            const decryptedEmail = decryptData(encryptedEmail, claveSecret);
            return { ...usuario, correo: decryptedEmail };
        });

    } catch (err) {
        handleServerError(res, err);
    }
};

async function ExisteUsuario(userId) {
    const sql = `SELECT ID_usuario FROM usuario WHERE ID_usuario = '${userId}'`;
    const result = await query(sql);
    return result.length > 0 ;
};


const crearUsuario = async (req, res) => {
    try {
        await bodyParser(req);
        const nuevoUsuario = req.body;
        console.log(nuevoUsuario.ID_role)
        console.log(req.hasOwnProperty("usuario"))

        if(nuevoUsuario.ID_role === 'admin' && !(req.hasOwnProperty("usuario") && req.usuario.role == 'superadmin')){
            sendResponse(res, 400, 'application/json', JSON.stringify({ error: "No posees los permisos necesarios para esta accion" }));
            return;
        }

        const usuariosExistentes = await getUsuariosExistentes(req, res);
        const resultadoValidacion = ValidarUsuario(nuevoUsuario, usuariosExistentes);

        if (!resultadoValidacion.isValid) {
            sendResponse(res, 400, 'application/json', JSON.stringify({ error: resultadoValidacion.error }));
            return;
        }

        if (!nuevoUsuario.ID_role || (nuevoUsuario.ID_role !== 'admin' && nuevoUsuario.ID_role !== 'usuario')) {
            nuevoUsuario.ID_role = 'usuario';
        }

        const encryptedEmail = encryptData(nuevoUsuario.correo, claveSecret);
        
        const hashedPassword = await bcrypt.hash(nuevoUsuario.password, 12);
        const query = 'INSERT INTO usuario(ID_usuario, nombre, correo, password, ID_municipio, ID_role, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, ?)';

        const valores = [
            nuevoUsuario.ID_usuario,
            nuevoUsuario.nombre,
            encryptedEmail,
            hashedPassword,
            nuevoUsuario.ID_municipio,
            nuevoUsuario.ID_role,
            new Date().toLocaleDateString("en-US")
        ];

        db.query(query, valores, (err, result) => {
            if (err) {
                handleServerError(res, err);
            } else {
                sendResponse(res, 200, 'application/json', 'Usuario creado exitosamente');
            }
        });

    } catch (err) {
        handleServerError(req, err);
    }
};

const AutenticarUsuario = async (req, res) => {
    try {
        await bodyParser(req);
        const contra = req.body.password;
        const nombreUsuario = req.body.idUsuario;

        if (!nombreUsuario || !contra) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid input' }));
            return;
        }

        const sql = 'SELECT ID_usuario, nombre, ID_role, password FROM usuario WHERE ID_usuario = ? LIMIT 1';
        const usuario = (await query(sql, [nombreUsuario]))[0];

        if (usuario) {
            // Compara la contraseña proporcionada con la contraseña almacenada en la base de datos
            const validaContra = await bcrypt.compare(contra, usuario.password);

            if (validaContra) {
                const token = jwt.sign({ idUsuario: usuario.ID_usuario, name: usuario.nombre, role: usuario.ID_role }, secretKey, { expiresIn: '24h' });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ token: token }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Datos Incorrectos' }));
            }
        } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'No existe usuario' }));
        }
    } catch (err) {
        throw err;
    }
};



const getAllUsuarios = async (req, res) => {
    try {
        const sql = `SELECT ID_Usuario, u.nombre, correo, m.nombre 'Municipio', ID_Role 'Role', fecha_creacion, denuncia_real, (SELECT COUNT(1) FROM problema p WHERE p.ID_Usuario = u.ID_Usuario) 'total_Problemas'
            FROM usuario u
                INNER JOIN municipio m on u.ID_municipio = m.ID_municipio
            WHERE ID_Role = 'usuario'`;
        const usuarios = await query(sql);

        // Desencripta el título y el contenido en cada resultado
        const resultado = usuarios.map(usu => {
            const correoDecrypt = decryptData(usu.correo, claveSecret);
            return { ...usu, correo: correoDecrypt, denuncia_real: usu.denuncia_real ?? 0};
        });

        if (resultado.length > 0) {
            sendResponse(res, 200, 'application/json', JSON.stringify(resultado));
        } else {
            sendResponse(res, 404, 'application/json', 'Sin usuarios creados');
        }
    } catch (err) {
        handleServerError(res, err);
    }
};

const getAllAdmins = async (req, res) => {
    try {
        const sql = `SELECT ID_Usuario, u.nombre, correo, m.nombre 'Municipio', ID_Role 'Role', fecha_creacion, borrados, user_borados
            FROM usuario u
                INNER JOIN municipio m on u.ID_municipio = m.ID_municipio
            WHERE ID_Role = 'admin'`;
        const usuarios = await query(sql);

        // Desencripta el título y el contenido en cada resultado
        const resultado = usuarios.map(usu => {
            const correoDecrypt = decryptData(usu.correo, claveSecret);
            return { ...usu, correo: correoDecrypt, borrados: usu.borrados ?? 0, user_borados: usu.user_borrados ?? 0};
        });

        if (resultado.length > 0) {
            sendResponse(res, 200, 'application/json', JSON.stringify(resultado));
        } else {
            sendResponse(res, 404, 'application/json', 'Sin usuarios creados');
        }
    } catch (err) {
        handleServerError(res, err);
    }
};

const getUserId = async (id) => {
    try {
        
        const sql = 'SELECT * FROM usuario WHERE ID_usuario = ? ';
        const result = await query(sql, [id]);

        if (result.length > 0) {

            const resultado = result.map(usu => {
                const correoDecrypt = decryptData(usu.correo, claveSecret);
                return { ...usu, correo: correoDecrypt, denuncia_real: usu.denuncia_real ?? 0};
            });

            return resultado;
        } else {
            return null;
        }
    } catch (err) {
        handleServerError(res, err);
    }
};


const deleteUsuario = async (req, res) => {
    try {
        const urlObj = url.parse(req.url, true);
        const userId = urlObj.query.id;
        console.log(userId);
        const userExists = await ExisteUsuario(userId);
        
        if (!userExists) {
            sendResponse(res, 400, 'application/json', JSON.stringify({ error: "Usuario No existe" }));
            return;
        }
        
        const usuario = await getUserId(userId);

        if(req.usuario.role === 'admin' && usuario[0].ID_role != 'usuario'){
            sendResponse(res, 400, 'application/json', JSON.stringify({ error: "No posees los permisos necesarios para realizar esta accion" }));
            return;
        }

        const deleteProblemas = 'DELETE FROM problema WHERE ID_usuario = ?';
        const deleteUsuario = 'DELETE FROM usuario WHERE ID_usuario = ?';
        
        db.query(deleteProblemas, userId, (err, result) => {
            if (err) {
                handleServerError(res, err);
            } else {
                db.query(deleteUsuario, userId, (err, result) => {
                    if (err) {
                        handleServerError(res, err);
                    } else {
                        sendResponse(res, 200, 'application/json', JSON.stringify('Usuario Eliminado exitosamente'));
                    }
                });
            }
        });

    } catch (err) {
        handleServerError(res, err);
    }
};

function encryptData(data, secretKey) {
    // Generar un IV aleatorio
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);

    let encryptedData = cipher.update(data, 'utf8', 'hex');
    encryptedData += cipher.final('hex');

    const result = iv.toString('hex') + encryptedData;

    return result;
}

function decryptData(encryptedData, secretKey) {
    // Extraer el IV del texto cifrado
    const ivLength = 32;
    const iv = Buffer.from(encryptedData.slice(0, ivLength), 'hex');
    const encryptedText = encryptedData.slice(ivLength);

    const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);

    let decryptedData = decipher.update(encryptedText, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');

    return decryptedData;
}

const sendResponse = (res, status, contentType, body) => {
    res.writeHead(status, { 'Content-Type': contentType });
    res.end(body);
}

const handleServerError = (res, error) => {
    console.error(error);
    sendResponse(res, 500, 'application/json', 'Error interno del servidor');
}

module.exports = { crearUsuario, AutenticarUsuario, ExisteUsuario, getAllUsuarios, deleteUsuario, getAllAdmins };
