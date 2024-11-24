export function menu_boton(text, options = {}) {
    const {role = "", extraClasses = "" } = options;

    const menu_boton = document.createElement('button');
    menu_boton.className = 'text-3xl h-14 bg-surface-100 rounded-xl hover:bg-blue-200 hover:shadow-xl ${extraClasses}';
    menu_boton.textContent = text;

    if (role === "admin") {
        menu_boton.classList.add("");
    }else if(role === "superadmin"){
        menu_boton.classList.add("");
    }

    return menu_boton;
}