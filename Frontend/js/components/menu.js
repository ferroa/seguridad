import { MENU_BUTTONS } from "../utils/consts.js";
import { menu_boton } from "./index.js";

export function menu() {
    console.log("ingresa a menu");
    const menu = document.createElement('div');
    menu.className = 'w-1/6 rounded-xl bg-surface-100 shadow flex flex-col justify-between p-2';
    const up_boton = document.createElement('div');

    up_boton.className = 'flex flex-col rounded-xl';
    const down_boton = document.createElement('div');
    down_boton.className = 'flex flex-col rounded-xl';
    const menu_boton1 = menu_boton(MENU_BUTTONS.GENERAL, {});
    const menu_boton2 = menu_boton(MENU_BUTTONS.MIS_REPORTES, {});
    const menu_boton3 = menu_boton(MENU_BUTTONS.SALIR, {});

    up_boton.appendChild(menu_boton1);
    up_boton.appendChild(menu_boton2);
    down_boton.appendChild(menu_boton3);

    menu.appendChild(up_boton);
    menu.appendChild(down_boton);
    
    

    return menu;
}