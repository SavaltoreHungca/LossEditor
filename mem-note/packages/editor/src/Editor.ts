import { Utils } from 'utils';
import { ScrollPage } from 'scroll-page'
import { render } from './render';
import { createCursor, setCursorPosition } from './cursor';
import { createElement, isTextNode } from './utils';
import { DragState } from 'utils';

export class Editor {
    // selection: Selection | null = null;
    cursor: HTMLTextAreaElement = createCursor();
    container: HTMLElement;
    viewLines: HTMLElement = createElement('view-lines');
    backLayer: HTMLElement = createElement('back-layer');
    scrollPage: ScrollPage;

    constructor(container: HTMLElement) {
        this.container = container;
        Utils.setStyle(this.container, {
            "white-space": "pre",
            width: "500px",
            height: "500px",
            position: "relative",
            padding: "2px",
            // font: '400 14px/1.4em "Segoe UI","Open Sans",Calibri,Candara,Arial,sans-serif',
            "font-family": 'Menlo, Monaco, "Courier New", monospace',
            "font-weight": 'normal',
            "font-size": '12px',
            "font-feature-settings": '"liga" 0, "calt" 0',
            "line-height": '18px',
            "letter-spacing": '0px',
        });
        this.container.appendChild(this.viewLines);
        const containerInfo = Utils.getElementInfo(container);
        Utils.setStyle(this.viewLines, {
            top: containerInfo.innerTop,
            left: containerInfo.innerLeft,
            width: containerInfo.innerWidth,
            height: containerInfo.innerHeight
        });
        this.container.appendChild(this.backLayer);
        Utils.setStyle(this.backLayer, {
            top: containerInfo.innerTop,
            left: containerInfo.innerLeft,
            width: containerInfo.innerWidth,
            height: containerInfo.innerHeight,
            'z-index': '-1'
        });
        this.backLayer.append(this.cursor);
        this.scrollPage = new ScrollPage(container);
        this.__init__();
    }

    __init__() {

        this.viewLines.addEventListener("click", (event: MouseEvent) => {
            this.cursor.focus();
        });
        render(
            [
                "当且仅当[[fomula(c = \\pm\\sqrt{a^2 + b^2})]]成立",
                "       工业和信息化部、财政部、商务部等5部门22日联合发布了修改后的乘用车企业平均燃料消耗量与新能源汽车积分并行管理办法，也就是常说的“双积分”管理办法。新办法更大力度提升了对企业节能减排方面的优惠政策，使汽车企业节能减排更“有利可图”",
                " ",
                // "       工业和信息化部、财政部、商务部等5部门22日联合发布了修改后的乘用车企业平均燃料消耗量与新能源汽车积分并行管理办法，也就是常说的“双积分”管理办法。新办法更大力度提升了对企业节能减排方面的优惠政策，使汽车企业节能减排更“有利可图”",
                [
                    ["工业和信息化部、财政部、商务部等5部门22日联合发布了修改后的乘用车企业平均燃料消耗量与新能源汽车积分并行管理办法，也就是常说的“双积分”", [["fucker"], ["man", "what"]]],
                    ["3",
                        [
                            ["1", '2'],
                            ['3', '238293823']
                        ]
                    ]
                ],
                // "       工业和信息化部、财政部、商务部等5部门22日联合发布了修改后的乘用车企业平均燃料消耗量与新能源汽车积分并行管理办法，也就是常说的“双积分”管理办法。新办法更大力度提升了对企业节能减排方面的优惠政策，使汽车企业节能减排更“有利可图”",
            ],
            this.viewLines
        );
        Utils.addEventListener('drag', this.viewLines, (e: DragState) => {
            if (e.event?.target) {
                const srcElement = <HTMLElement>e.event.target;
                if (isTextNode(srcElement)) {
                    const mousePosi = Utils.getMousePositionInElement(srcElement, <MouseEvent>e.event)
                    let critical = srcElement.innerText.length / 2;
                    while (true) {
                        const text = srcElement.innerText.substring(0, critical);
                        const textLen = Utils.getStrPx(text, srcElement).width;
                        console.log(text);
                        if (Math.abs(mousePosi.left - textLen) < 10) {
                            console.log(text);
                            break;
                        }
                        if (textLen > mousePosi.left) {
                            critical -= critical / 2;
                            continue;
                        }
                        if (textLen < mousePosi.left) {
                            critical += critical / 2;
                            continue;
                        }
                    }
                }
            }
        })
        // document.addEventListener("selectionchange", (event)=>{
        //     event.preventDefault()
        //     setCursorPosition(<Selection>window.getSelection(), this.cursor, this.container);
        // })
    }

}