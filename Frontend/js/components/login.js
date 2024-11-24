import { input, boton } from "./index.js";
import { PLACEHOLDERS, BUTTON_TEXT } from "../utils/consts.js";


export function login(){
    const login = document.createElement('div');
    login.className = 'w-1/2 h-1/2 rounded-xl bg-blue-200 shadow flex flex-col justify-center items-center align-center';

    const titulo = document.createElement('h1');
    titulo.className = 'text-5xl p-6';
    titulo.textContent = BUTTON_TEXT.LOGIN;
    const textFields = document.createElement('div');
    const buttons = document.createElement('div');

    const usuario = input("text", PLACEHOLDERS.USUARIO_PLACE_HOLDER, {});
    const password = input("password", PLACEHOLDERS.USUARIO_PASSWORD_HOLDER, {});
    const log = boton(BUTTON_TEXT.LOGIN, {});
    const regisrar = boton(BUTTON_TEXT.REGISTRARSE, {});

    textFields.appendChild(usuario);
    textFields.appendChild(password);
    textFields.className = 'w-3/5 h-4/5 flex flex-col gap-8';

    buttons.appendChild(log);
    buttons.appendChild(regisrar);
    buttons.className = 'w-3/5 h-1/5 flex flex-row justify-center gap-8 pb-4',

    login.appendChild(titulo);
    login.appendChild(textFields);
    login.appendChild(buttons);
    

    return login;
}