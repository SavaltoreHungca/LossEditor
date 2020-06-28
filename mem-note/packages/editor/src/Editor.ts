import { Utils } from 'utils';
import { Element } from 'utils';
import { ScrollPage } from 'scroll-page'
import { render } from './render';
import { createCursor, setCursorPosition } from './cursor';


export class Editor {
    // selection: Selection | null = null;
    cursor: HTMLTextAreaElement = createCursor();
    container: HTMLElement;
    scrollPage: ScrollPage;

    constructor(container: HTMLElement) {
        this.container = container;
        this.scrollPage = new ScrollPage(container);
        this.__init__();
    }

    __init__() {
        Utils.setStyle(this.container, {
            "white-space": "pre",
            width: "500px",
            height: "500px"
        });
        this.container.append(this.cursor);
        this.container.addEventListener("click", (event: MouseEvent)=>{
            // console.log(event);
            console.log(window.getSelection())
            setCursorPosition(<Selection>window.getSelection(), this.cursor, this.container);
            // this.cursor.focus();
        });
        render(
            ["       工业和信息化部、财政部、商务部等5部门22日联合发布了修改后的乘用车企业平均燃料消耗量与新能源汽车积分并行管理办法，也就是常说的“双积分”管理办法。新办法更大力度提升了对企业节能减排方面的优惠政策，使汽车企业节能减排更“有利可图”"],
            this.container
        );
        // document.addEventListener("selectionchange", ()=>{
            
        // })
    }

}