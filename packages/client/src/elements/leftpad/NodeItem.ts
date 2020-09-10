import { Element } from '../Element';
import { MemLoss } from '../../MemLoss';
import { innerHtml, $$, $ } from 'utils';
import { Node } from '../../repository/transferTypes';
import { creEle } from '../elementTypes';
import { classes } from '../../styleClassSheet';

export interface NodeItem extends Element {
    render: (node: Node, level: number) => void
}

export function nodeItemExt(memloss: MemLoss) {
    return (nodeItem: Element) => {
        nodeItem.setStyle({
            cursor: 'pointer', width: '100%'
        })
        return {
            render: (node: Node, level: number) => {

                const idset = {
                    children: $$.randmonId(),
                    titlebar: $$.randmonId(),
                }

                // 点击标题打开node
                const onopeneditor = (self: HTMLElement) => {
                    
                }

                nodeItem.set('opend', false);
                const onsubopen = (self: HTMLElement) => {
                    if (nodeItem.get('opend')) {
                        innerHtml(self, '<i class="fa fa-caret-right fa-1x" aria-hidden="true"></i>', true)
                        nodeItem.set('opend', false);
                        $(idset.children).innerHTML = '';
                    } else {
                        innerHtml(self, '<i class="fa fa-caret-down fa-1x" aria-hidden="true"></i>', true)
                        for (let child of node.children || []) {
                            const item = creEle(memloss, 'nodeItem');
                            item.render(child, level + 1);
                            $(idset.children).appendChild(item);
                        }
                        nodeItem.set('opend', true);
                        memloss.nodeListPad.updateSize();
                    }
                }

                innerHtml(nodeItem, `
                    <div id="${idset.titlebar}" class="${classes.backChSelectd}" style="position: relative; display: block;">
                        <div style="padding-left: ${14 * level}px; overflow: hidden; text-overflow: ellipsis; min-width: 0; white-space: nowrap;">
                            <span style="display: inline-block; position: relative">
                                <div 
                                    class="${classes.backChSelectd}"
                                    style="user-select: none;transition: background 120ms ease-in 0s;cursor: pointer;display: flex;align-items: center;justify-content: center;width: 20px;height: 20px;border-radius: 3px;"
                                    onclick="${$$.anonyFunction(onsubopen)}(this)">
                                    <i class="fa fa-caret-right fa-1x" aria-hidden="true"></i>
                                </div>
                            </span>
                            <span style="display: inline-block; position: relative">${node.tag}</span>
                            <span onclick="${$$.anonyFunction(onopeneditor)}(this)" class="${classes.textUnderLine}" style="display: inline-block; position: relative">${node.title}</span>
                        </div>
                    </div>
                    <div id="${idset.children}"></div>
                `)
            }

        };
    }
}



// function addClickMenu(memloss: MemLoss, elmt: HTMLElement) {
//     elmt.addEventListener('contextmenu', (e: MouseEvent) => {
//         e.preventDefault();
//         const moousePosi = $$.getMousePositionInElement(document.body, e);
//         const contextMenu: any = $$.creEle('block');
//         document.body.appendChild(contextMenu);
//         contextMenu.setStyle({
//             position: 'absolute',
//             left: moousePosi.left,
//             top: moousePosi.top,
//         });

//         const menucontent = [
//             ['Add subpage', 'fa-plus'],
//             ['Delete', 'fa-trash'],
//             ['Rename', 'fa-pencil-square-o'],
//         ].map(item => {
//             return `
//             <div class="${classes.backChSelectd}" style="display: flex; align-items: center; line-height: 120%; width: 100%; user-select: none; min-height: 28px; font-size: 14px;">
//                 <div style="display: flex; align-items: center; justify-content: center; margin-left: 14px;">
//                     <i class="fa ${item[1]}" aria-hidden="true"></i>
//                 </div>
//                 <div style="padding-left: 5px">
//                     ${item[0]}
//                 </div>
//             </div>
//         `
//         }).join('')
//         contextMenu.innerHTML = `
//             <div style="border-radius: 3px; background: white; position: relative; box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px; z-index: 102">
//                 <div style="display: flex; flex-direction: column; width: 220px; min-width: 180px; max-width: calc(100vw - 24px); height: 100%; max-height: 70vh;">
//                     ${menucontent}
//                 </div>
//             </div>
//         `

//         const stopPropagation = (e: MouseEvent) => {
//             e.stopPropagation();
//         }
//         const cancel = () => {
//             document.body.removeChild(contextMenu);
//             document.removeEventListener('click', cancel);
//             document.removeEventListener('contextmenu', cancelCon);
//         }
//         let firstContextMenu = true
//         const cancelCon = () => {
//             if (firstContextMenu) {
//                 firstContextMenu = false;
//                 return;
//             }
//             cancel();
//         }
//         document.addEventListener('click', cancel);
//         document.addEventListener('contextmenu', cancelCon);
//         contextMenu.addEventListener('click', stopPropagation);
//         contextMenu.addEventListener('contextmenu', stopPropagation)
//     })
// }