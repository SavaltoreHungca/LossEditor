import { Constants } from './Constants';
import { EventManager } from 'event-driven';
import { createElement, Element, wrapElement, NodeListPad, OpendPages, FunctionMenu, EditorFrame } from './Element';
import { registryEvents } from './events';
import { nodelist } from './testdata';

export interface Elements {
    container: Element;
    sidePad: Element;
    editorFrame: EditorFrame;
    sidePadResizingBar: Element;
    nodeListPad: NodeListPad;
    opendPages: OpendPages;
    functionMenu: FunctionMenu;
}

export class MemLoss {
    eventManager: EventManager = new EventManager();
    elements: Elements;

    constructor(container: HTMLElement) {
        registryEvents(this);
        this.elements = {
            container: wrapElement(this, container, 'container'),
            sidePad: createElement(this, 'sidePad'),
            editorFrame: createElement(this, 'editorFrame', 'EditorFrame'),
            sidePadResizingBar: createElement(this, 'sidePadResizingBar'),
            nodeListPad: createElement(this, 'nodeListPad', 'NodeListPad'),
            opendPages: createElement(this, 'opendPages', 'OpendPages'),
            functionMenu: createElement(this, 'functionMenu', 'FunctionMenu'),
        }
        this.eventManager.triggleEvent(Constants.events.ELEMENTS_BUILD_FINISH);
        this.elements.nodeListPad.renderList(nodelist)
    }
}