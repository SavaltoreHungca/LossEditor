import { Element } from '../Element';
import { MemLoss } from '../../MemLoss';
import { innerHtml, $$, $, Nil } from 'utils';
import { Node } from '../../repository/transferTypes';
import { creEle } from '../elementTypes';
import { classes } from '../../styleClassSheet';
import { repository } from "../../repository/Request";

export interface NodeItem extends Element {
    render: (node: Node, level: number) => void
    toggleFold(shouldFold?: boolean): void
    isOpend: boolean
    nodeData: Node
    level: number
}

export function nodeItemExt(memloss: MemLoss) {
    return (nodeItem: Element) => {
        nodeItem.setStyle({
            cursor: 'pointer', width: '100%'
        });

        const idset = {
            children: $$.randmonId(),
            titlebar: $$.randmonId(),
            oepnButton: $$.randmonId(),
            title: $$.randmonId(),
        }
        return {
            render: function (node: Node, level: number) {
                this.nodeData = node;
                this.level = level;

                innerHtml(nodeItem, `
                    <div id="${idset.titlebar}" class="${classes.backChSelectd}" style="position: relative; display: block;">
                        <div style="padding-left: ${14 * level}px; overflow: hidden; text-overflow: ellipsis; min-width: 0; white-space: nowrap;">
                            <span style="display: inline-block; position: relative">
                                <div id="${idset.oepnButton}"
                                    class="${classes.backChSelectd}"
                                    style="user-select: none;transition: background 120ms ease-in 0s;cursor: pointer;display: flex;align-items: center;justify-content: center;width: 20px;height: 20px;border-radius: 3px;"
                                    >
                                    <i class="fa fa-caret-right fa-1x" aria-hidden="true"></i>
                                </div>
                            </span>
                            <span style="display: inline-block; position: relative">${node.tag}</span>
                            <span id="${idset.title}" class="${classes.textUnderLine}" style="display: inline-block; position: relative; margin-left: 8px">${node.title}</span>
                        </div>
                    </div>

                    <div id="${idset.children}"></div>
                `, true);

                $(idset.oepnButton).addEventListener('click', () => {
                    this.toggleFold()
                })
                $(idset.title).addEventListener('click', () => {
                    // 点击标题打开node
                    repository.getNodeContent(this.nodeData.id, (status, data) => {
                        switch (status) {
                            case 'ok':
                                memloss.notePad.openTab({
                                    id: this.nodeData.id,
                                    name: this.nodeData.title,
                                    content: data
                                });
                                break;
                            case 'processing':
                                break;
                            case 'failed':
                                break
                        }
                    })
                })

            },
            toggleFold: function (shouldFold?: boolean) {
                if (typeof shouldFold === 'undefined') {
                    shouldFold = !this.isOpend;
                }

                if (shouldFold) {
                    innerHtml($(idset.oepnButton), '<i class="fa fa-caret-down fa-1x" aria-hidden="true"></i>', true)

                    for (let child of this.nodeData.children || []) {
                        const item = creEle(memloss, 'nodeItem');
                        $(idset.children).appendChild(item);
                        item.render(child, this.level + 1);
                    }

                    this.isOpend = true;
                }
                else {
                    innerHtml($(idset.oepnButton), '<i class="fa fa-caret-right fa-1x" aria-hidden="true"></i>', true)

                    $(idset.children).innerHTML = '';
                    this.isOpend = false;
                }

                memloss.nodeListPad.updateSize();
            },
            isOpend: false,
            level: 1,
            nodeData: <Node>Nil
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