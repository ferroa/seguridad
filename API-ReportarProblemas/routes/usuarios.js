const usersController = require('../controllers/usuarios');

function handleMethodNotAllowed(req, res) {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end('Method Not Allowed');
}

const createUsuarioRoute = (req, res) => {
    if (req.method === "POST") {
        usersController.crearUsuario(req, res);
    } else {
        handleMethodNotAllowed(req, res);
    }
}

const iniciarSesionRoute = (req, res) => {
    if (req.method === "POST") {
        usersController.AutenticarUsuario(req, res);
    } else {
        handleMethodNotAllowed(req, res);
    }
}

const getAllUsuariosRoute = (req, res) => {
    if (req.method === "GET") {
        usersController.getAllUsuarios(req, res);
    } else {
        handleMethodNotAllowed(req, res);
    }
}

const deleteUsuarioRoute = (req, res) => {
    if (req.method === "DELETE") {
        usersController.deleteUsuario(req, res);
    } else {
        handleMethodNotAllowed(req, res);
    }
}

const getAllAdminRoute = (req, res) => {
    if (req.method === "GET") {
        usersController.getAllAdmins(req, res);
    } else {
        handleMethodNotAllowed(req, res);
    }
}

module.exports = { createUsuarioRoute, iniciarSesionRoute,getAllUsuariosRoute, deleteUsuarioRoute, getAllAdminRoute };