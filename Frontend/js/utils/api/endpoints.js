//JavaScript
import { getAPI_URL } from "./config.js";

const API_URL = getAPI_URL();

const EP_AUTH = `${API_URL}auth`;
const EP_AUTH_GENERATETOKEN = `${EP_AUTH}/generateToken`;
const EP_AUTH_GETROLES = `${EP_AUTH}/getRoles`;

//user endpoints
const EP_REPORTES = `${API_URL}reporte`;
const EP_REPORTES_GET_LIST = `${EP_REPORTES}/getReportes`;
const EP_REPORTES_GET_PROPIOS = `${EP_REPORTES}/getMisReportes`;
const EP_REPORTES_GET_UNO = `${EP_REPORTES}/detalle`;
const EP_REPORTES_POST = `${EP_REPORTES}/post`;
const EP_REPORTES_UPDATE = (id) => `${EP_REPORTES}/update/${id}`;
const EP_REPORTES_DELETE = (id) => `${EP_REPORTES}/delete/${id}`;




export { EP_AUTH_GENERATETOKEN, EP_AUTH_GETROLES };
