import { Utils } from 'utils';
import { Element } from 'utils';
import { ScrollPage } from 'scroll-page'
import { render } from './render';
import { createCursor } from './cursor';


export class Editor {
    selection: Selection | null = null;
    cursor: HTMLTextAreaElement = createCursor();
    
    constructor(container: HTMLElement) {
        new ScrollPage(container);
        Utils.setStyle(container, {
            "white-space": "pre",
            width: "500px", 
            height: "500px"
        });
        container.append(this.cursor)
        render(["wo                                                                                                                                                                                                                                                                                                                                                                                                                              de"], container);
        document.addEventListener("selectionchange", ()=>{
            this.selection = window.getSelection();
        })
    }

}