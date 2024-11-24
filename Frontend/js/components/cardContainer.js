
import { ReportCard } from "./reportCard.js";

export function CardContainer(data) {

    console.log("Ingresa a card container....")
    const card_container = document.createElement('div');
    card_container.className = 'w-5/6 h-full rounded-xl bg-surface-50 gap-3 flex flex-wrap p-4';
    const add_boton = document.createElement('button');
    add_boton.className = 'absolute right-10 bottom-10 flex flex-row items-center justify-center w-24 h-24 gap-x-2 p-2 rounded-[28px] overflow-hidden shadow-xl tracking-[.00714em] bg-blue-300 hover:scale-105 '
    const svg = document.createElement('img');
    svg.src = '../../img/plus.png';
    svg.className = 'w-75 h-75';
    add_boton.appendChild(svg);

    for (let i = 0; i < data.length; i++) {
        const card = ReportCard(data[i]);
        card_container.appendChild(card);
    }
    card_container.appendChild(add_boton);
    return card_container;
}
  