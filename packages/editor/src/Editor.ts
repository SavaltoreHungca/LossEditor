import { EventManager } from 'event-driven';
import { Utils } from 'utils';
import { ScrollPage } from 'scroll-page'
import { render } from './render';
import { createCursor, listenSelectionToSetCursor } from './cursor';
import { createElement, isTextNode } from './utils';
import { DragState } from 'utils';
import { listenUserChangeSelection, Selection } from './Selection';


export class Editor {
    cursor: HTMLTextAreaElement = createCursor();
    container: HTMLElement;
    viewLines: HTMLElement = createElement('view-lines');
    backLayer: HTMLElement = createElement('back-layer');
    scrollPage: ScrollPage;
    eventManager: EventManager = new EventManager();
    selection: Selection | undefined;

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
            height: containerInfo.innerHeight,
            'user-select': 'none'
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
        this.scrollPage = new ScrollPage(container, {
            containerWidth: '504px',
            debug: false
        });
        this.__init__();
    }

    __init__() {

        this.viewLines.addEventListener("click", (event: MouseEvent) => {
            this.cursor.focus();
        });
        render(
            [
                {
                    type: 'paragraph',
                    indentation: 2,
                    content: "当且仅当[[formula(c = \\pm\\sqrt{a^2 + b^2})]]成立"
                },
                {
                    type: 'paragraph',
                    content: "内嵌代码框笑[[code(http://baidu.com)]]嘻嘻, 我的附件[[attachment(http://baidu.com)]]在这里呢"
                },
                {
                    type: 'paragraph',
                    indentation: 1,
                    content: "       工业和信息化部、财政部、商务部等5部门22日联合发布了修改后的乘用车企业平均燃料消耗量与新能源汽车积分并行管理办法，也就是常说的“双积分”管理办法。新办法更大力度提升了对企业节能减排方面的优惠政策，使汽车企业节能减排更“有利可图”"
                },
                {
                    type: 'image',
                    indentation: 1,
                    content: 'https://www.necoichi.co.jp/files/topics/6239_ext_01_0.jpg'
                },
                {
                    type: 'table',
                    indentation: 1,
                    content: [
                        [{
                            type: 'paragraph',
                            indentation: 2,
                            content: "       工业和信息化部、财政部、商务部等5部门22日联合发布了修改后的乘用车企业平均燃料消耗量与新能源汽车积分并行管理办法，也就是常说的“双积分”管理办法。新办法更大力度提升了对企业节能减排方面的优惠政策，使汽车企业节能减排更“有利可图”"
                        }, {
                            type: 'table',
                            content: [[{type: 'paragraph', content: 'shit'}]]
                        }],
                        [{type: 'paragraph', content: '3'},
                            {
                                type: 'table',
                                content: [
                                    [{type: 'paragraph', content: '1'}, {type: 'paragraph', content: '2'}],
                                    [{type: 'paragraph', content: '3'}, {type: 'paragraph', content: '112312312412'}]
                                ]
                            }
                        ]
                    ]
                },
                {
                    type: 'table',
                    indentation: 1,
                    content: [
                        [
                            {
                                type: 'paragraph',
                                indentation: 1,
                                content: "1"
                            },
                            {
                                type: 'paragraph',
                                indentation: 1,
                                content: "2"
                            }
                        ],
                        [
                            {
                                type: 'paragraph',
                                indentation: 1,
                                content: "3"
                            },
                            {
                                type: 'paragraph',
                                indentation: 1,
                                content: "4"
                            }
                        ]
                    ]
                }
                // "       工业和信息化部、财政部、商务部等5部门22日联合发布了修改后的乘用车企业平均燃料消耗量与新能源汽车积分并行管理办法，也就是常说的“双积分”管理办法。新办法更大力度提升了对企业节能减排方面的优惠政策，使汽车企业节能减排更“有利可图”",
            ],
            this.viewLines
        );
        listenUserChangeSelection(this);
        listenSelectionToSetCursor(this);
    }

}