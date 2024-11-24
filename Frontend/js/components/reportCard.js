import { TEXT_GENERAL } from '../utils/consts.js';

export function ReportCard(reporte) {

    console.log(reporte)

    const card = document.createElement('div');
    card.className = ' p-4 w-96 h-40 rounded-3xl bg-gray-300 flex flex-row hover:bg-blue-300 hover:scale-105 hover:shadow-xl';
  
    const textos = document.createElement('div');
    textos.className = 'pb-2 h-full flex flex-col justify-between text-xl';

    const autor = document.createElement('h3');
    autor.textContent = TEXT_GENERAL.AUTOR;

    const fecha = document.createElement('h3');
    fecha.textContent = TEXT_GENERAL.FECHA;

    const direccion = document.createElement('h3');
    direccion.textContent = TEXT_GENERAL.DIRECCION;

    textos.appendChild(autor);
    textos.appendChild(fecha);
    textos.appendChild(direccion);


    const autor_data = document.createElement('h3');
    autor_data.textContent = reporte.autor;

    const fecha_data = document.createElement('h3');
    fecha_data.textContent = reporte.fecha;

    const direccion_data = document.createElement('h3');
    direccion_data.textContent = reporte.direccion;

    const contenido = document.createElement('div');
    contenido.className = 'pl-2 h-full flex flex-col justify-between';

    contenido.appendChild(autor_data);
    contenido.appendChild(fecha_data);
    contenido.appendChild(direccion_data);

    card.appendChild(textos);
    card.appendChild(contenido);
  
    return card;
}
  