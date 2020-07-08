import { Constants } from './Constants';
import { EventManager } from 'event-driven';
import { createElement, Element, wrapElement, NodeListElement, EditorFrameElement, SidePadElement } from './Element';
import { registryEvents } from './events';

export interface Elements {
    container?: Element;
    sidPad?: SidePadElement;
    editorFrame?: EditorFrameElement;
    nodeList?: NodeListElement;
    functionMenu?: Element;
}

export class MemLoss {
    eventManager: EventManager = new EventManager();
    elements: Elements = {};

    constructor(container: HTMLElement) {
        registryEvents(this);
        this.elements = {
            container: wrapElement(this, container, 'container'),
        }
        this.eventManager.triggleEvent(Constants.events.ELEMENTS_BUILD_FINISH);
    }
}