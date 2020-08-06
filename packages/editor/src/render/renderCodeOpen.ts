import { $$ } from "utils";
import { Inlineblock } from "../elements/elementTypes";

export function renderCodeOpen(content: string, unitBlock: Inlineblock) {
    unitBlock.innerHTML = '<i class="fa fa-codepen fa-2x" aria-hidden="true"></i>';
    $$.setStyle(unitBlock, {
        cursor: 'pointer'
    })
}
