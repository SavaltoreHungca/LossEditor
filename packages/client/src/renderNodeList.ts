import { createElement, randomId, $ } from "./Element";
import { MemLoss } from "./MemLoss";
import { Utils } from "utils";
import { renderWindow } from "./renderWindows";

export interface Node {
    id: string
    tag: string
    title: string
    children: Array<Node>
}

export interface NodeList {
    list: Array<Node>
}

export function renderNodeList(memloss: MemLoss, nodeParents: Array<Node>, list: Array<Node>, level: number, elemtCreated: (item: HTMLElement) => void): Array<HTMLElement> {
    const ans = new Array<HTMLElement>();
    for (let node of list) {
        const item = createElement(memloss, 'item-block');
        elemtCreated(item); // 将元素先挂载
        ans.push(item);

        const idset = {
            children: randomId(),
            titlebar: randomId(),
        }

        item.setStyle({ cursor: 'pointer', width: '100%' })


        // 点击打开子菜单事件
        item.set('opend', false);
        const onsubopen = Utils.anonyFunction((self: HTMLElement) => {
            if (item.get('opend')) {
                self.innerHTML = '<i class="fa fa-caret-right fa-1x" aria-hidden="true"></i>';
                item.set('opend', false);

                $(idset.children).innerHTML = '';
            } else {
                self.innerHTML = '<i class="fa fa-caret-down fa-1x" aria-hidden="true"></i>';
                item.set('opend', true);

                if (node.children) {
                    renderNodeList(memloss, [...nodeParents, node], node.children, level + 1, item => $(idset.children).appendChild(item));
                }
            }
        })

        // 点击标题打开node
        const onopeneditor = Utils.anonyFunction((self: HTMLElement) => {
            const { editorFrame } = memloss.elements;
            if(!editorFrame) throw new Error();
            renderWindow(memloss, editorFrame, nodeParents, node);
        });


        item.innerHTML = `
            <div id="${idset.titlebar}" class="background-change-selected" style="position: relative; display: block;">
                <div style="padding-left: ${14 * level}px; overflow: hidden; text-overflow: ellipsis; min-width: 0; white-space: nowrap;">
                    <!-- 折叠按钮 -->
                    <span style="display: inline-block; position: relative">
                        <div 
                            class="background-change-selected"
                            style="user-select: none;transition: background 120ms ease-in 0s;cursor: pointer;display: flex;align-items: center;justify-content: center;width: 20px;height: 20px;border-radius: 3px;"
                            onclick="${onsubopen}(this)">
                            <i class="fa fa-caret-right fa-1x" aria-hidden="true"></i>
                        </div>
                    </span>
                    <span style="display: inline-block; position: relative">${node.tag}</span>
                    <span onclick="${onopeneditor}(this)" class="text-underline-selected" style="display: inline-block; position: relative">${node.title}</span>
                </div>
            </div>
            <div id="${idset.children}"/>
        `
        addClickMenu(memloss, $(idset.titlebar));
    }
    return ans;
}

function addClickMenu(memloss: MemLoss, elmt: HTMLElement) {
    elmt.addEventListener('contextmenu', (e: MouseEvent) => {
        e.preventDefault();
        const moousePosi = Utils.getMousePositionInElement(document.body, e);
        const contextMenu = createElement(memloss, 'context-menu');
        document.body.appendChild(contextMenu);
        contextMenu.setStyle({
            position: 'absolute',
            left: moousePosi.left,
            top: moousePosi.top,
        });

        const menucontent = [
            ['Add subpage', 'fa-plus'],
            ['Delete', 'fa-trash'],
            ['Rename', 'fa-pencil-square-o'],
        ].map(item => {
            return `
            <div class="background-change-selected" style="display: flex; align-items: center; line-height: 120%; width: 100%; user-select: none; min-height: 28px; font-size: 14px;">
                <div style="display: flex; align-items: center; justify-content: center; margin-left: 14px;">
                    <i class="fa ${item[1]}" aria-hidden="true"></i>
                </div>
                <div style="padding-left: 5px">
                    ${item[0]}
                </div>
            </div>
        `
        }).join('')
        contextMenu.innerHTML = `
            <div style="border-radius: 3px; background: white; position: relative; box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px; z-index: 102">
                <div style="display: flex; flex-direction: column; width: 220px; min-width: 180px; max-width: calc(100vw - 24px); height: 100%; max-height: 70vh;">
                    ${menucontent}
                </div>
            </div>
        `

        const stopPropagation = (e: MouseEvent) => {
            e.stopPropagation();
        }
        const cancel = () => {
            document.body.removeChild(contextMenu);
            document.removeEventListener('click', cancel);
            document.removeEventListener('contextmenu', cancelCon);
        }
        let firstContextMenu = true
        const cancelCon = () => {
            if (firstContextMenu) {
                firstContextMenu = false;
                return;
            }
            cancel();
        }
        document.addEventListener('click', cancel);
        document.addEventListener('contextmenu', cancelCon);
        contextMenu.addEventListener('click', stopPropagation);
        contextMenu.addEventListener('contextmenu', stopPropagation)
    })
}