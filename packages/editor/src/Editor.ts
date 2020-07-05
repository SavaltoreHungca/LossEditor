import { EventManager } from 'event-driven';
import { Utils } from 'utils';
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
    eventManager: EventManager = new EventManager();
    selection: Selection | undefined;

    constructor(container: HTMLElement) {
        this.container = container;
        Utils.setStyle(this.container, {
            "white-space": "pre",
            position: "relative",
            padding: "2px",
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
        this.__init__();
    }

    render(data: any){
        render(data, this.viewLines);
    }

    private __init__() {

        this.viewLines.addEventListener("click", (event: MouseEvent) => {
            this.cursor.focus();
        });
        listenUserChangeSelection(this);
        listenSelectionToSetCursor(this);
    }

}