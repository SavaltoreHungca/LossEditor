import { EventManager, DataListener } from 'event-driven';
import { Utils } from 'utils';
import { render } from './render';
import { createCursor, listenSelectionToSetCursor } from './cursor';
import { createElement, isTextNode } from './utils';
import { DragState } from 'utils';
import { listenUserChangeSelection, Selection } from './Selection';
import { listenContainerSizeChange } from './autoResize';


export class Editor {
    cursor: HTMLTextAreaElement = createCursor();
    container: HTMLElement;
    viewLines: HTMLElement = createElement('view-lines');
    backLayer: HTMLElement = createElement('back-layer');
    eventManager: EventManager = new EventManager();
    dataListener: DataListener = new DataListener(200);
    selection: Selection | undefined;
    data: any;

    constructor(container: HTMLElement) {
        this.container = container;
        Utils.setStyle(this.container, {
            "white-space": "pre",
            position: "relative",
            "font-family": 'Menlo, Monaco, "Courier New", monospace',
            "font-weight": 'normal',
            "font-size": '12px',
            "font-feature-settings": '"liga" 0, "calt" 0',
            "line-height": '18px',
            "letter-spacing": '0px',
            height: 'fit-content'
        });
        this.container.appendChild(this.viewLines);
        const containerInfo = Utils.getElementInfo(container);
        Utils.setStyle(this.viewLines, {
            top: containerInfo.innerTop,
            left: containerInfo.innerLeft,
            width: containerInfo.innerWidth,
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
        this.__init__();
    }

    render(data: any){
        this.data = data;
        render(data, this.viewLines);
    }

    updateSize(){
        const containerInfo = Utils.getElementInfo(this.container);
        Utils.setStyle(this.viewLines, {width: containerInfo.innerWidth});
        this.render(this.data);
    }

    private __init__() {

        this.viewLines.addEventListener("click", (event: MouseEvent) => {
            this.cursor.focus();
        });
        listenUserChangeSelection(this);
        listenSelectionToSetCursor(this);
        listenContainerSizeChange(this);
    }

}