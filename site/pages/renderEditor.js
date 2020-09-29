import { Editor } from 'editor';
import { ScrollPage } from 'scroll-page';
import { MemLoss } from 'client';
import { innerHtml, $$, $ } from 'utils'
import { renderMemLoss } from './renderMemLoss';
import { renderScrollPage } from './renderScrollPage';

export function renderEditor(container) {
    const idset = {
        spcontainer: $$.randmonId()
    }
    innerHtml(container, `
        <div style="height: 200px; width: 200px">
            <div id="${idset.spcontainer}"></div>
        </div>
    `)

    const editor = new Editor({
        width: 200,
        height: 200,
        container: $(idset.spcontainer),
    });

    editor.render();

    editor.sizeFollowOutContainer();
}

const doc = {
    type: 'root',
    sentinelAct: {
        placeholder: 'type something in here',
        style: {
            color: 'grey'
        }
    },
    children: [{
        type: 'paragraph',
        content: {
            str: '如果说你是海上的花火,我是兰花的泡沫,这一刻你照亮了我'
        }
    }]
}