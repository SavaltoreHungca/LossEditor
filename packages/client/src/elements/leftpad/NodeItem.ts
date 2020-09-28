import { Element } from '../Element';
import { MemLoss } from '../../MemLoss';
import { innerHtml, $$, $, Nil, ct, MapObj } from 'utils';
import { Node } from '../../repository/transferTypes';
import { creEle } from '../elementTypes';
import { classes } from '../../styleClassSheet';
import { repository } from "../../repository/Request";
import { isHotkey } from 'is-hotkey';

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
                        <div style="padding-left: ${14 * level}px; overflow: hidden; min-width: 0; white-space: nowrap; display: flex; flex-wrap: nowrap; align-items: center;">
                            <span style="display: block; position: relative">
                                <div id="${idset.oepnButton}"
                                    class="${classes.backChSelectd}"
                                    style="user-select: none;transition: background 120ms ease-in 0s;cursor: pointer;display: flex;align-items: center;justify-content: center;width: 20px;height: 20px;border-radius: 3px;"
                                    >
                                    <i class="fa fa-caret-right fa-1x" aria-hidden="true"></i>
                                </div>
                            </span>
                            <span style="display: block; position: relative">${node.tag}</span>
                            <span id="${idset.title}" class="${classes.textUnderLine}" style="display: block; position: relative; margin-left: 8px; width: 0; flex-grow: 1; overflow: hidden; text-overflow: ellipsis;">
                                ${node.title}
                            </span>
                        </div>
                    </div>

                    <div id="${idset.children}"></div>
                `, true);
                this.addClickMenu();

                $(idset.oepnButton).addEventListener('click', () => {
                    this.toggleFold()
                });
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
                });

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
            nodeData: <Node>Nil,
            addClickMenu: function () {
                $$.addContextMenu($(idset.titlebar), (menu, opt, evt) => {
                    const menuidset = {
                        addpage: $$.randmonId(),
                        delete: $$.randmonId(),
                        rename: $$.randmonId(),

                        rename_input_container: $$.randmonId(),
                        rename_input: $$.randmonId(),
                    }

                    innerHtml(menu, `
                        <div style="width: fit-content; border-radius: 3px; background: white; position: relative; box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px; z-index: 102">
                            <div style="display: flex; flex-direction: column; width: 220px; height: 100%;">
                                ${getContextMenuItem(menuidset.addpage, 'Add subpage', 'fa-plus')}
                                ${getContextMenuItem(menuidset.delete, 'Delete', 'fa-trash')}
                                ${getContextMenuItem(menuidset.rename, 'Rename', 'fa-pencil-square-o')}
                            </div>
                        </div>
                    `, true);

                    $(menuidset.rename).addEventListener('click', (evt: MouseEvent) => {

                        const modifyNameIdsetId = $$.randmonId();
                        innerHtml($(idset.title), `
                            <input id="${modifyNameIdsetId}"
                                style="
                                    width: calc(100% - 6px);
                                    outline: none;
                                    border: 1px solid olivedrab;
                                    padding: 0;
                                    margin: 0;
                                    background: none;
                                    font: ${($$.getComputedStyle($(idset.title), 'font') || '').replace(/\"/g, '\'')};
                                "
                                value="${this.nodeData.title}"
                            ></input>
                        `, true);

                        const input: HTMLInputElement = ct($(modifyNameIdsetId));
                        input.focus();
                        input.select();

                        const confirm = () => {
                            if(input.value && input.value.trim() !== ''){
                                this.nodeData.title = input.value;
                            }
                            $(idset.title).innerHTML = this.nodeData.title;
                        }

                        input.addEventListener('click', (evt: MouseEvent) => {
                            evt.stopPropagation();
                        })
                        input.addEventListener('blur', confirm)
                        input.addEventListener('keydown', (ev: KeyboardEvent)=>{
                            if(isHotkey(['enter', 'esc'], ev)){
                                input.removeEventListener('blur', confirm);
                                confirm();
                            }
                        })

                        opt.cancelMenu();
                    })
                });
            }
        };
    }
}


function getContextMenuItem(id: string, name: string, tagType: string) {
    return `
        <div id="${id}" class="${classes.backChSelectd}" style="display: flex; align-items: center; line-height: 120%; width: 100%; user-select: none; min-height: 28px; font-size: 14px;">
            <div style="display: flex; align-items: center; justify-content: center; margin-left: 14px;">
                <i class="fa ${tagType}" aria-hidden="true"></i>
            </div>
            <div style="padding-left: 5px">
                ${name}
            </div>
        </div>
    `
}