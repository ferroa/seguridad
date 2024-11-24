const http = require('http');
const routeUser = require('./routes/usuarios');
const routeProblemas = require('./routes/problemas');
const jwt = require('jsonwebtoken');

const SECRET = require('./config');
//para token
const secretKey = SECRET.SECRETKEY;

const requestTracker = {};
const rateLimit = 5;
const rateLimitWindow = 60 * 1000;


const server = http.createServer((req, res) => {

    const { url, method } = req;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');

    const verificarToken = (req, res, next) => {
        let token = req.headers.authorization;

        if (!token) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Token no proporcionado' }));
        } else {
            if (token.startsWith('Bearer')) {
                token = token.slice(7);
            }

            jwt.verify(token, secretKey, (err, decoded) => {
                if (err) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Token inválido' }));
                } else {
                    req.usuario = decoded;
                    next();
                }
            });
        }
    };

    const applyRateLimit = (clientIP) => {
        if (!requestTracker[clientIP]) {
            requestTracker[clientIP] = [];
        }

        const currentTime = new Date().getTime();
        const recentRequests = requestTracker[clientIP].filter((time) => currentTime - time < rateLimitWindow);

        if (recentRequests.length >= rateLimit) {
            res.writeHead(429, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Rate limit exceeded' }));
            return false;
        }

        requestTracker[clientIP].push(currentTime);
        requestTracker[clientIP] = requestTracker[clientIP].filter((time) => currentTime - time < rateLimitWindow);

        return true;
    };

    switch (method) {
        case 'GET':
            if (url === "/") {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ message: "HELLO WORlD" }));
                res.end();
            }
            // ruta para traer todas las notas del usuario
            else if (url === ('/api/problemas')) {
                verificarToken(req, res, () => {
                    if (req.socket.remoteAddress) {
                        usersRoles(req, res, routeProblemas.getAllProblemas)
                    }
                });
            }
            //ruta para obtener todos los usuario
            else if (url === '/api/usuarios') {
                verificarToken(req, res, () => {
                    if (applyRateLimit(req.socket.remoteAddress)) {
                        adminSuperadmin(req, res, routeUser.getAllUsuariosRoute);
                    }
                });
            }
            //ruta para obtener todos los administradores
            else if (url === '/api/administradores') {
                verificarToken(req, res, () => {
                    if (applyRateLimit(req.socket.remoteAddress)) {
                        adminSuperadmin(req, res, routeUser.getAllAdminRoute);
                    }
                });
            }
            break;
        case 'POST':
            //ruta para creacion de usuario
            if (url.startsWith('/api/usuarios')) {
                if(req.headers.authorization){
                    verificarToken(req, res, () => {
                        if(req.socket.remoteAddress){
                            usersRoles(req, res, routeUser.createUsuarioRoute)
                        }
                    });
                }
                else if (req.socket.remoteAddress) {
                    routeUser.createUsuarioRoute(req, res);
                }
            }
            //ruta para iniciar sesion y  obtener token
            else if (url === '/api/login') {
                if(req.socket.remoteAddress)
                    routeUser.iniciarSesionRoute(req, res);
            }
            //ruta para crear problemas 
            else if (url.startsWith('/api/problemas')) {
                verificarToken(req, res, () => {
                    if(req.socket.remoteAddress){
                    usersRoles(req, res, routeProblemas.crearProblemaRoute)
                }
                });
            }
            else {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.write("404 Not Found");
                res.end();
            }
            break;
        case 'DELETE':
            //ruta para eliminar usuario
            if (url.startsWith('/api/usuarios?')) {
                verificarToken(req, res, () => {
                    adminSuperadmin(req, res, routeUser.deleteUsuarioRoute)
                });
            }
            else {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.write("404 Not Found");
                res.end();
            }
            break
        case 'PUT':
            //ruta para mopdificar un problema
            if (url.startsWith('/api/problemas')) {
                verificarToken(req, res, () => {
                    if(req.socket.remoteAddress){
                    usersRoles(req, res, routeProblemas.modificarProblemaRoute)
                }
                });
            }
            break;
        case 'PATCH':
            //ruta para cambiar el estado de un problea
            if (url.startsWith('/api/problemas')) {
                verificarToken(req, res, () => {
                    if (req.usuario.role === "usuario")
                        routeProblemas.actualizaEstadoUsuarioRoute(req, res)
                    else
                        routeProblemas.actualizarEstadoProblemaRoute(req, res)
                });
            } else {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.write("404 Not Found");
                res.end();
            }
            break;
        default:
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.write("404 Not Found");
            res.end();
            break;
    }
});

const adminSuperadmin = (req, res, routeFunction) => {
    if (req.usuario.role === "usuario") {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Acceso prohibido para usuarios con rol "usuario"' }));
    } else {
        routeFunction(req, res);
    }
};

const Superadmin = (req, res, routeFunction) => {
    if (req.user.usuario != "superadmin") {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Acceso prohibido para usuarios con rol "usuario"' }));
    } else {
        routeFunction(req, res);
    }
};


const usersRoles = (req, res, routeFunction) => {
    
    if (!req.usuario.role) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Acceso prohibido para usuarios con rol "usuario"' }));
    } else {
        routeFunction(req, res);
    }
}

const port = SECRET.PORT;

server.listen(port, () => {
    console.log(`El servidor esta corriendo en el puerto ${port}`)
});

