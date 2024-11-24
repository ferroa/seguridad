import { boton, input, titulo } from "./index.js";
import { BUTTON_TEXT, PLACEHOLDERS, TEXT_GENERAL } from "../utils/consts.js";
import { data } from "../../data/exampleData.json" with { type: 'json'};
export function modal(text) {
    const modal = document.createElement("dialog");
    modal.className = "";

    switch (text) {
        case "registro":
            const usuario = input("text", PLACEHOLDERS.USUARIO_PLACE_HOLDER, {});
            const correo = input("email", PLACEHOLDERS.REGISTRO_CORREO_HOLDER, {});
            const municipio = document.createElement('select');
            


            break;

        default:
            break;
    }

    return modal;
}
