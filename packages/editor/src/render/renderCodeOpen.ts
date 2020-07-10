import { Utils } from "utils";

export function renderCodeOpen(content: string, unitBlock: HTMLElement) {
    unitBlock.innerHTML = '<i class="fa fa-codepen fa-2x" aria-hidden="true"></i>';
    Utils.setStyle(unitBlock, {
        cursor: 'pointer'
    })
}
