export function boton(text) {
    const boton = document.createElement('button');
    boton.className = 'w-32 h-16 text-xl rounded-xl bg-blue-300 hover:bg-blue-400 hover:shadow-xl ${extraClasses}';
    boton.textContent = text;
    //boton.onclick("click", );    

    return boton;
}