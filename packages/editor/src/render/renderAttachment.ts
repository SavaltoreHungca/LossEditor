import { $$ } from 'utils';
import { Inlineblock } from '../elements/elementTypes';

export function renderAttachment(content: string, unitBlock: Inlineblock) {
    unitBlock.innerHTML = '<i class="fa fa-file-archive-o fa-2x" aria-hidden="true"></i>';
    $$.setStyle(unitBlock, {
        cursor: 'pointer'
    })
}