import { EventManager } from 'event-driven';
import { Settings } from "../Settings";
import { Utils, DragState } from 'utils';
import uuid from 'uuid';
import { ScrollPage } from '../ScrollPage';

export abstract class Element {

    private dragStates: Map<string, DragState> = new Map();
    protected proxy: HTMLElement;
    protected global: ScrollPage;

    constructor(element: HTMLElement, global: ScrollPage) {
        this.proxy = element;
        this.global = global;
        this.setAttribute("data-scroll-page-type", this.getType());
        this.__init__();
    }

    abstract __init__(): void;

    
}

