
import { Utils } from './Utils';

export interface DragState {
    startX: number;
    startY: number;
    pressed: boolean;
    deltaX: number;
    deltaY: number;
    registered: boolean;
    event?: Event
}

export class Global {
    private globalElement: Map<String, Element> = new Map();

    get(id: string): Element | undefined{
        return this.globalElement.get(id);
    }

    set(id: string, elemt: Element){
        this.globalElement.set(id, elemt);
    }
}

export class Element {
    private proxy: HTMLElement;
    private dragState: DragState = {
        startX: 0,
        startY: 0,
        pressed: false,
        deltaX: 0,
        deltaY: 0,
        registered: false,
        event: undefined
    }
    private global?: Global = undefined;
    
    constructor(element: HTMLElement, global: Global) {
        this.proxy = element;
        this.global = global;
    }
    append(element: Element) {
        this.proxy.append(element.proxy);
    }
    appendNative(native: HTMLElement) {
        this.proxy.append(native);
    }
    focus() {
        this.proxy.focus();
    }
    setStyle(style: Object) {
        Utils.setStyle(this.proxy, style);
    }

    getInlineCssStyle() {
        return Utils.getInlineCssStyle(this.proxy);
    }
    getCssStyle(): CSSStyleDeclaration {
        return this.proxy.style;
    }

    addEventListener(
        name: string,
        callback: Function,
        option: boolean | AddEventListenerOptions
    ) {
        if (name === 'drag') {
            this.dragState.pressed = false;
            this.dragState.registered = false;
            this.proxy.addEventListener('mousedown', (event) => {
                this.dragState.startX = event.screenX;
                this.dragState.startY = event.screenY;
                this.dragState.pressed = true;
            })

            let resizing = (event: MouseEvent) => {
                if (this.dragState.pressed) {
                    this.dragState.deltaX = event.screenX - this.dragState.startX;
                    this.dragState.deltaY = event.screenY - this.dragState.startY;
                    this.dragState.startX += this.dragState.deltaX;
                    this.dragState.startY += this.dragState.deltaY;

                    this.dragState.event = event;
                    callback(this.dragState);
                }
            };
            let resizeDone = (event: MouseEvent) => {
                this.dragState.pressed = false;
                this.dragState.registered = false;
                document.removeEventListener('mousemove', resizing);
                document.removeEventListener('mouseup', resizeDone);
                Utils.setStyle(document.body, { "user-select": "" });

                callback(this.dragState);
            };
            this.proxy.addEventListener('mousemove', (event) => {
                if (this.dragState.pressed && !this.dragState.registered) {
                    this.dragState.registered = true;
                    Utils.setStyle(document.body, { "user-select": "none" });
                    document.addEventListener('mousemove', resizing);
                    document.addEventListener('mouseup', resizeDone);
                }
            })
            return;
        }
        this.proxy.addEventListener(name, callback as any, option);
    }

    getInfo() {
        return Utils.getElementInfo(this.proxy);
    }

    show() {
        this.cancelDisappear();
        this.setStyle({ visibility: 'visible' });
    }

    cancelDisappear() {
        for (let i of this.disappearIds) {
            clearTimeout(i);
        }
    }

    private disappearIds: Array<number> = [];
    disappear(delay: number) {
        if (delay) {
            this.cancelDisappear();
            let id = window.setTimeout(() => { this.setStyle({ visibility: 'hidden' }) }, delay);
            this.disappearIds.push(id);
        } else {
            this.setStyle({ visibility: 'hidden' });
        }
    }

    cancelLastTimeout(id: string) {
        let ids = this.timeoutIdMap.get(id) || [];
        for (let i of ids) {
            clearTimeout(i);
        }
    }

    timeoutIdMap: Map<String, Array<number>> = new Map();
    setLastTimeout(id: string, func: Function, delay: number) {
        let ids = this.timeoutIdMap.get(id);
        if (!Utils.isArray(ids)) {
            ids = [];
            this.timeoutIdMap.set(id, ids);
        }
        this.cancelLastTimeout(id);
        ids?.push(window.setTimeout(func, delay));
    }

    setRole(roleName: string) {
        this.proxy.setAttribute("data-role", roleName);
    }

    setWidth(width: string){
        this.setStyle({width: width});
    }

    setHeight(height: string){
        this.setStyle({height: height});
    }
}