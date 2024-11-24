export function titulo(text) {
    const titulo = document.createElement('div');
    titulo.className = 'w-full h-20 rounded-xl bg-surface-200 shadow-md text-5xl flex flex-row justify-center items-center align-center';
    titulo.textContent = text;

    return titulo;
}