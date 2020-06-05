
import { Utils } from './Utils';

interface DragState {
    startX: number;
    startY: number;
    pressed: boolean;
    deltaX: number;
    deltaY: number;
    registered: boolean;
}

export class Element {
    private proxy: HTMLElement;
    private dragState: DragState = {
        startX: 0,
        startY: 0,
        pressed: false,
        deltaX: 0,
        deltaY: 0,
        registered: false
    }
    private global = undefined;
    constructor(element: HTMLElement, global) {
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

    addEventListener<K extends keyof HTMLElementEventMap>(
        name: string,
        callback: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
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

            let resizing = (event) => {
                if (this.dragState.pressed) {
                    this.dragState.deltaX = event.screenX - this.dragState.startX;
                    this.dragState.deltaY = event.screenY - this.dragState.startY;
                    this.dragState.startX += this.dragState.deltaX;
                    this.dragState.startY += this.dragState.deltaY;
                    callback({
                        ...event,
                        ...this.dragState
                    });
                }
            };
            let resizeDone = (event) => {
                this.dragState.pressed = false;
                this.dragState.registered = false;
                this.global.document.removeEventListener('mousemove', resizing);
                this.global.document.removeEventListener('mouseup', resizeDone);
                Utils.setStyle(this.global.document.body, { "user-select": "" });
                callback({
                    path: event.path,
                    ...this.dragState
                });
            };
            this.proxy.addEventListener('mousemove', (event) => {
                if (this.dragState.pressed && !this.dragState.registered) {
                    this.dragState.registered = true;
                    Utils.setStyle(this.global.document.body, { "user-select": "none" });
                    this.global.document.addEventListener('mousemove', resizing);
                    this.global.document.addEventListener('mouseup', resizeDone);
                }
            })
            return;
        }
        this.proxy.addEventListener(name, callback, option);
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
            this.global.window.clearTimeout(i);
        }
    }

    disappearIds = [];
    disappear(delay) {
        if (delay) {
            this.cancelDisappear();
            let id = this.global.window.setTimeout(() => { this.setStyle({ visibility: 'hidden' }) }, delay);
            this.disappearIds.push(id);
        } else {
            this.setStyle({ visibility: 'hidden' });
        }
    }

    cancelLastTimeout(id) {
        let ids = this.timeoutIdMap.get(id);
        if (Utils.isArray(ids)) {
            for (let i of ids) {
                this.global.window.clearTimeout(i);
            }
        }
    }

    timeoutIdMap = new Map();
    setLastTimeout(id, func, delay) {
        let ids = this.timeoutIdMap.get(id);
        if (!Utils.isArray(ids)) {
            ids = [];
            this.timeoutIdMap.set(id, ids);
        }
        this.cancelLastTimeout(id);
        ids.push(this.global.window.setTimeout(func, delay));
    }

    setRole(roleName) {
        this.proxy.setAttribute("data-role", roleName);
    }
}