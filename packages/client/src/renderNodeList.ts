import { NodeListPad, createElement } from "./Element";
import { MemLoss } from ".";

export interface Node {
    img: string
    title: string
    children: Array<Node>
}

export interface NodeList {
    list: Array<Node>
}

export function renderListFactory(memloss: MemLoss, elmt: HTMLElement):  (data: NodeList) => void{
    return (data: NodeList) => {
        const self = <NodeListPad> elmt;
        const nodeList = self.getNodeList();

        if(data.list){
            for(let node of data.list){
                const item = createElement(memloss, 'item-block');
                const foldbutton = createElement(memloss, 'item-block', 'InlineBlock');
                const title = createElement(memloss, 'item-title', 'InlineBlock');
                const img = createElement(memloss, 'item-img', 'InlineBlock');

                nodeList.appendChild(item);
                item.appendChild(foldbutton);
                item.appendChild(img);
                item.appendChild(title);

                item.setStyle({
                    width: '100%'
                })
                foldbutton.innerHTML = `<i class="fa fa-caret-right fa-1x" aria-hidden="true"></i>`
                title.innerText = node.title;
                img.innerText = node.img;
                
            }
        }
    }
}