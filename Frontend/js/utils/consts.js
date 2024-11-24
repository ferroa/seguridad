//config
export const API = {
    API_URL_DEV: "",
    API_URL_PROD: ""

};

//DOM events
export const EVENTS = {
    EVENT_CHANGE: "change",
    EVENT_CLICK: "click",
    EVENT_INPUT: "input",
    EVENT_LOAD: "load",
    EVENT_MOUSEENTER: "mouseenter",
    EVENT_MOUSELEAVE: "mouseleave",
    EVENT_RESET: "reset",
    EVENT_SUBMIT: "submit"

};

//HTTP Commons
export const HTTP_CONTENT_JSON = "application/json";

// Verbos HTTP
export const HTTP_METHODS = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    PATCH: "PATCH"
};
  
// Códigos y mensajes de error HTTP
export const HTTP_ERRORS = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
    503: "Service Unavailable",
};
  
// Mensajes de validación para alertas y formularios
export const VALIDATION_MESSAGES = {
    CAMPO_REQUERIDO: "Informacion requerida.",
    CORREO_INVALIDO: "Ingrese un correo valido.",
    CONTRASENIA_MUY_CORTA: "La contraseña debe ser por lo menos de 16 caracteres alpha númericos.",
    CONTRASENIAS_NO_COINCIDEN: "Las contraseñas no coninciden.",
    NUMERO_INVALIDO: "Ingrese un número válido."
};
  
// Placeholders de los campos de texto
export const PLACEHOLDERS = {
    USUARIO_PLACE_HOLDER: "Ingrese su usuario...",
    USUARIO_PASSWORD_HOLDER: "Ingrese su contraseña...",
    REGISTRO_NOMBRE_HOLDER: "Ingrese su nombre...",
    REGISTRO_CORREO_HOLDER: "Ingrese su correo...",
    REGISTRO_UBICACION_HOLDER: "Ingrese su ubicacion...",
    REGISTRO_PASSWORD_HOLDER: "Ingrese su contraseña...",
    REGISTRO_PASSWORD_CONFIRM_HOLDER: "Confirme su contraseña..."
};
  
// Textos de los botones
export const BUTTON_TEXT = {
    LOGIN: "Login",
    REGISTRARSE: "Registrarse",
    GUARDAR: "Guardar",
    CANCELAR: "Cancelar",
    ELIMINAR: "Eliminar",
    MODIFICAR: "Modificar",
    REESTABLECER: "Reestablecer",
};
  
// Textos para botones de menú
export const MENU_BUTTONS = {
    GENERAL: "General",
    MIS_REPORTES: "Mis reportes",
    SALIR: "Salir",
    DENUNCIAS: "Denuncias",
    USUARIOS: "Usuarios"
};
  
// Títulos de las páginas
export const PAGE_TITLES = {
    REPORTES: "Reportes",
    DETALLES_REPORTE: "Detalles de reporte",
    AGREGAR_REPORTE: "Agregar reporte",
    DETALLES_USUARIO: "Detalles de usuario",
    USUARIOS: "Usuarios"
};

// textos generales en forms
export const TEXT_GENERAL = {
//TEXTO SOBRE REPORTE
    AUTOR: "Autor",
    DIRECCION: "Dirección",
    FECHA: "Fecha",
    GRAVEDAD: "Gravedad",
    TIPO: "Tipo",
    MUNICIPIO: "Municipio",
//TEXTOS SOBRE USUARIO
    DENUNCIAS_REALES: "Denuncias reales",
    FECHA_CREACION: "Fecha de creación",
    REPORTES: "Reportes",
    NOMBRE: "Nombre",
    CORREO: "Correo",
    UBICACION: "Ubicación",
    CONTRASENIA: "Contraseña",
    CONFIRMAR_CONTRASENIA: "Confirmar contraseña"
};
  