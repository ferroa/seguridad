const problemaController = require('../controllers/problemas');

const crearProblemaRoute = (req, res) => {
    if (req.method === "POST") {
        problemaController.CrearProblema(req, res);
    } else {
        handleMethodNotAllowed(req, res);
    }
};

const getAllProblemas = (req, res) => {
    if (req.method === "GET") {
        problemaController.getAllProblemas(req, res);
    } else {
        handleMethodNotAllowed(req, res);
    }
};

const modificarProblemaRoute = (req, res) => {
    if (req.method === "PUT") {
        problemaController.updateProblema(req, res);
    } else {
        handleMethodNotAllowed(req, res);
    }
};

const actualizaEstadoUsuarioRoute = (req, res) => {
    if (req.method === "PATCH") {
        problemaController.actualizaEstadoUsuario(req, res);
    } else {
        handleMethodNotAllowed(req, res);
    }
};

const actualizarEstadoProblemaRoute = (req, res) => {
    if (req.method === "PATCH") {
        problemaController.actualizarEstadoProblema(req, res);
    } else {
        handleMethodNotAllowed(req, res);
    }
};

function handleMethodNotAllowed(req, res) {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end('Method Not Allowed');
};

module.exports = { crearProblemaRoute, getAllProblemas, modificarProblemaRoute, actualizaEstadoUsuarioRoute, actualizarEstadoProblemaRoute};