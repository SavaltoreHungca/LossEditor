import { Utils } from 'utils';

export function renderAttachment(content: string, unitBlock: HTMLElement) {
    unitBlock.innerHTML = '<i class="fa fa-file-archive-o fa-2x" aria-hidden="true"></i>';
    Utils.setStyle(unitBlock, {
        cursor: 'pointer'
    })
}