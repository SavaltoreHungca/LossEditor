import { Editor } from 'editor';
import { ScrollPage } from 'scroll-page';
import { MemLoss } from 'client';
import { innerHtml, $$, $ } from 'utils'
import { renderMemLoss } from './renderMemLoss';
import { renderScrollPage } from './renderScrollPage';

export function renderEditor(container) {
    new Editor({
        width: 300,
        height: 300,
        container: container,
        document: {
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
    });
}