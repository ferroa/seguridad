const { ExisteGravedad, ExisteTipo, ExisteMunicipio, ExisteEstado } = require('../controllers/validaciones');

const problemaScheme =
{
    ID_problema : {
        type: String,
        required: true,
        unique: true,
        textoError: 'Tipo de Problema'
    },
    direccion : {
        type: String,
        required: true,
        textoError: 'Direccion del problema'
    },
    fecha : {
        type: String
    },
    ID_gravedad : {
        type: String,
        required: true,
        textoError: 'Gravedad'
    },
    ID_tipo : {
        type: String,
        required: true
    },
    ID_usuario : {
        type: String
    },
    ID_municipio : {
        type: String,
        required: true
    },
    ID_estado : {
        type: Number
    }
}

const ValidarProblema = async (nuevoProblema, problemasExistentes, accion = 'I') => {
    for(const key in problemaScheme)
        if(problemaScheme[key].required && !nuevoProblema[key])
            return { isValid: false, error: `El campo "${problemaScheme[key].textoError}" es requerido.` };
            // return { isValid: false, error: `El campo "${key}" es requerido.` };


    if (problemasExistentes && problemasExistentes.some(prob => prob.ID_problema === nuevoProblema.ID_problema) && accion === 'I') {
        return { isValid: false, error: 'El campo "ID_PROBLEMA" debe ser único.' };
    }

    if (problemasExistentes && !problemasExistentes.some(prob => prob.ID_problema === nuevoProblema.ID_problema) && accion === 'U') {
        return { isValid: false, error: 'El id problema no existe.' };
    }

    const valGravedad = await ExisteGravedad(nuevoProblema.ID_gravedad)
    if(nuevoProblema.ID_gravedad && !valGravedad)
        return { isValid: false, error: 'El Id Gravedad no existe' };

    const valTipo = await ExisteTipo(nuevoProblema.ID_tipo)
    if(nuevoProblema.ID_tipo && !valTipo)
        return { isValid: false, error: 'El Id Tipo no existe' };

    const valmunicipio = await ExisteMunicipio(nuevoProblema.ID_municipio)
    if(nuevoProblema.ID_municipio && !valmunicipio)
        return { isValid: false, error: 'El Id Municipio no existe' };

    const valestado = await ExisteEstado(nuevoProblema.ID_estado)
    if(nuevoProblema.ID_estado && !valestado)
        return { isValid: false, error: 'El Id Estado no existe' };


    return { isValid: true, error: null };
}

module.exports = { ValidarProblema };