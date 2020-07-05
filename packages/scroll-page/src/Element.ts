import {EventManager} from 'event-driven';
import { Settings } from "./Settings";
import { Utils, DragState } from 'utils';
import uuid from 'uuid';

export class Global {
    protected globalElement: Map<string, Element> = new Map();
    protected globalData: Map<string, any> = new Map();
    settings: Settings;
    eventManager: EventManager;


    constructor(eventManager: EventManager, settings: Settings){
        this.eventManager = eventManager;
        this.settings = settings;
    }

    get(id: string): Element {
        const elemt = this.globalElement.get(id);
        if (!elemt) throw new Error(`$(id) not found`);
        return elemt;
    }

    set(id: string, elemt: Element) {
        this.globalElement.set(id, elemt);
    }

    setData(id: string, data: any) {
        this.globalData.set(id, data);
    }

    getData(id: string) {
        this.globalData.get(id);
    }

    getAll() {
        let ans: { [index: string]: Element } = {};
        this.globalElement.forEach((value, key) => {
            ans[key] = value;
        })
        return ans;
    }
}


export class Element {
 
    private dragStates: Map<string, DragState> = new Map();
    protected proxy: HTMLElement;
    protected global: Global;

    constructor(element: HTMLElement, global: Global) {
        this.proxy = element;
        this.global = global;
        this.setAttribute("data-scroll-page-type", this.getType());
        this.__init__();
    }
    protected __init__(){

    }
    setWidth(wdith: string){
        this.setStyle({width: wdith});
        this.global.eventManager.triggleEvent(`${this.getType().toUpperCase()}_WIDTH_CHANGE`);
    }

    setHeight(height: string){
        this.setStyle({height: height});
        this.global.eventManager.triggleEvent(`${this.getType().toUpperCase()}_HEIGHT_CHANGE`);
    }

    setLeft(left: string){
        this.setStyle({left: left});
        this.global.eventManager.triggleEvent(`${this.getType().toUpperCase()}_LEFT_CHANGE`);
    }

    setRight(right: string){
        this.setStyle({right: right});
        this.global.eventManager.triggleEvent(`${this.getType().toUpperCase()}_RIGHT_CHANGE`);
    }

    setTop(top: string){
        this.setStyle({top: top});
        this.global.eventManager.triggleEvent(`${this.getType().toUpperCase()}_TOP_CHANGE`);
    }

    setBottom(bottom: string){
        this.setStyle({bottom: bottom});
        this.global.eventManager.triggleEvent(`${this.getType().toUpperCase()}_BUTTOM_CHANGE`);
    }
    getType(): string {
        return Object.getPrototypeOf(this).constructor.name;
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
        option?: boolean | AddEventListenerOptions
    ) {
        Utils.addEventListener(name, this.proxy, callback, option);
    }

    getInfo() {
        return Utils.getElementInfo(this.proxy);
    }
    visible(): boolean{
        return this.getCssStyle().visibility !== 'hidden';
    }
    show() {
        this.cancelDisappear();
        this.cancelFadeOut();
        this.setStyle({ visibility: 'visible' });
    }

    cancelDisappear() {
        for (let i of this.disappearIds) {
            clearTimeout(i);
        }
    }

    private opacity: number = 1;
    private initialOpacity: number = -1;
    private fadeGradient: number = 0.1;
    private fadeInterval: number = 100;
    private fadeoutGoing: boolean = false;
    private FADE_OUT_TIME_ID = "FADE_OUT_TIME_ID";
    fadeOut(duration?: number) {
        if(this.fadeoutGoing) return;
        if (!duration) duration = 1500;
        if (this.getCssStyle().opacity === "") {
            this.initialOpacity = 1;
        } else {
            this.initialOpacity = parseFloat(this.getCssStyle().opacity);
        }
        this.opacity = this.initialOpacity;
        this.fadeInterval = duration / 10 < 100 ? 100 : duration / 10;
        this.fadeGradient = this.initialOpacity / (duration / this.fadeInterval);

        const fadeFunc = () => {
            let newopacity = this.opacity - this.fadeGradient;
            if (newopacity <= 0) {
                this.disappear();
                this.cancelFadeOut();
                return;
            }
            this.setStyle({
                opacity: newopacity
            })
            this.opacity = newopacity;
            this.setLastTimeout(this.FADE_OUT_TIME_ID, fadeFunc, this.fadeInterval);
        }
        this.fadeoutGoing = true;
        this.setLastTimeout(this.FADE_OUT_TIME_ID, fadeFunc, this.fadeInterval);
    }

    cancelFadeOut() {
        if (this.fadeoutGoing) {
            this.cancelLastTimeout(this.FADE_OUT_TIME_ID);
            if (this.initialOpacity !== -1) {
                this.setStyle({
                    opacity: this.initialOpacity
                })
            }
        }
        this.fadeoutGoing = false;
    }

    private disappearIds: Array<number> = [];
    disappear(delay?: number, callback?: Function) {
        this.cancelDisappear();
        this.cancelFadeOut();
        if (delay) {
            let id = window.setTimeout(() => {
                this.setStyle({ visibility: 'hidden' });
                if (callback) callback();
            }, delay);
            this.disappearIds.push(id);
        } else {
            this.setStyle({ visibility: 'hidden' });
            if (callback) callback();
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

    setAttribute(name: string, value?: string) {
        if (!value) value = "";
        this.proxy.setAttribute(name, value);
    }
    getNative(): HTMLElement {
        return this.proxy;
    }
    addClass(c: string){
        Utils.addClass(this.proxy, c);
    }
}

