import { EventManager, DataListener } from 'event-driven';
import { Utils } from 'utils';
import { render } from './render';
import { createCursor, listenSelectionToSetCursor } from './cursor';
import { createElement } from './utils';
import { DragState } from 'utils';
import { listenUserChangeSelection, Selection } from './Selection';
import { listenContainerSizeChange } from './autoResize';
import { listenSelectionChangeToSetSelectedRegion } from './renderSelectedRegion';
import { listenTextInput } from './textInput';


export class Editor {
    cursor: HTMLTextAreaElement;
    container: HTMLElement;
    viewLines: HTMLElement = createElement('view-lines');
    backLayer: HTMLElement = createElement('back-layer');
    regionContainer: HTMLElement = document.createElement('div');
    eventManager: EventManager = new EventManager();
    dataListener: DataListener = new DataListener(200);
    selection: Selection | undefined;
    data: any;
    inputText: string = '';

    constructor(container: HTMLElement) {
        this.container = container;
        this.cursor = createCursor(this);
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
            'z-index': '-1'
        });
        this.backLayer.appendChild(this.cursor);
        Utils.setStyle(this.regionContainer, {
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0,
            'z-index': '-1'
        })
        this.backLayer.appendChild(this.regionContainer);
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
        listenUserChangeSelection(this);
        listenSelectionToSetCursor(this);
        listenContainerSizeChange(this);
        listenSelectionChangeToSetSelectedRegion(this);
        listenTextInput(this);
    }

}