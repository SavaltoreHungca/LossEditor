import { Element } from './Element';
import { MemLoss } from '../MemLoss';
import { innerHtml, $$, $ } from 'utils';
import { creEle } from './elementTypes';
import isHotkey from 'is-hotkey';

export interface Container extends Element {

}

export function containerExt(memloss: MemLoss) {
    return (container: Element) => {
        container.setStyle({
            display: 'flex',
            'user-select': 'none',
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            top: 0,
            left: 0,
            
        });

        container.addEventListener('wheel', (event)=>{
            event.preventDefault();
        })

        const idSet = {
            leftSidePadId: $$.randmonId(),
            rightSidePadId: $$.randmonId(),
            globalSearch: $$.randmonId(),
        }

        innerHtml(container, `
            <div id="${idSet.globalSearch}"></div>
            <div id="${idSet.leftSidePadId}"
                style="position: relative; display: flex; flex-direction: column; height: 100%; background: rgb(247, 246, 243); user-select: none">
            </div>
            <div id="${idSet.rightSidePadId}"
                style="display: flex; flex-direction: column; flex-grow: 1; position: relative; width: auto; height: 100%; overflow: hidden">
            </div>
        `);

        memloss.rightSidePad = creEle(memloss, 'rightSidePad', $(idSet.rightSidePadId));
        memloss.leftSidePad = creEle(memloss, 'leftSidePad', $(idSet.leftSidePadId));
        memloss.globalSearch = creEle(memloss, 'globalSearch', $(idSet.globalSearch));

        return {};
    }
}
