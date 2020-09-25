import { Editor } from 'editor';
import { ScrollPage } from 'scroll-page';
import { MemLoss } from 'client';
import { innerHtml, $$, $ } from 'utils'
import { renderMemLoss } from './renderMemLoss';
import { renderScrollPage } from './renderScrollPage';
import { renderEditor } from './renderEditor';

export function render(container) {
    const idset = {
        container: $$.randmonId()
    }

    innerHtml(container, `
        <div Container id="${idset.container}" style="margin-top: 10px; border: 1px dotted grey"></div>
    `)

    renderMemLoss($(idset.container));
    // renderScrollPage($(idset.container));
    // renderEditor($(idset.container));
}