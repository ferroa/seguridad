const usuarioScheme =
{
    ID_usuario : {
        type: String,
        required: true,
        unique: true,
        textoError: 'Usuario'
    },
    nombre : {
        type: String,
        required: true,
        textoError: 'Nombre Usuario'
    },
    correo : {
        type: String,
        required: true,
        unique: true,
        textoError: 'Correo Electronico'
    },
    password : {
        type: String,
        required: true,
        textoError: 'Contraseña'
    },
    ID_municipio : {
        type: String,
        required: true,
        textoError: 'Municipio'
    },
    ID_role : {
        type: String
    },
    fecha_creacion : {
        type: String
    },
    denuncia_real : {
        type: Number
    },
    borrados : {
        type: Number
    },
    user_borados : {
        type: Number
    }
}

const ValidarUsuario = (nuevoUsuario, usuariosExistentes) => {
    for(const key in usuarioScheme)
        if(usuarioScheme[key].required && !nuevoUsuario[key])
            return { isValid: false, error: `El campo "${usuarioScheme[key].textoError}" es requerido.` };
            // return { isValid: false, error: `El campo "${key}" es requerido.` };

    if (usuariosExistentes && usuariosExistentes.some(usuario => usuario.ID_usuario === nuevoUsuario.ID_usuario)) {
        return { isValid: false, error: 'El campo "ID_Usuario" debe ser único.' };
    }

    if (usuariosExistentes && usuariosExistentes.some(usuario => usuario.correo === nuevoUsuario.correo)) {
        return { isValid: false, error: 'El campo "Correo" debe ser único.' };
    }

    return { isValid: true, error: null };
}

module.exports = { ValidarUsuario };