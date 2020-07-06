import { MemLoss } from "./MemLoss";
import { Utils, ElementInfo } from 'utils';
import { ScrollPage } from 'scroll-page';
import uuid from 'uuid';

export function randomId(){
    return "_" + uuid.v1().replace(/-/g, '');
}
export function $(id: string): HTMLElement {
    return <HTMLElement>document.getElementById(id);
}

export interface Element extends HTMLElement {
    set(name: string, data: any): void;
    get(name: string): any;
    getType(): string;
    setWidth(width: number): void;
    setHeight(height: number): void;
    setTop(top: number): void;
    setLeft(left: number): void;
    setStyle(style: Object): void;
    getInfo(consumer?: (info: ElementInfo) => void): ElementInfo;
    addClass(c: string): void;
}

export function wrapElement(memloss: MemLoss, elmt: HTMLElement, alias: string): Element {
    const functions = extendFunctions(memloss, elmt);
    for (let key in functions) {
        elmt[key] = functions[key];
    }
    elmt.setAttribute("data-mem-loss-type", alias);
    return <Element>elmt;
}

export function createElement(memloss: MemLoss, alias: string, type?: 'inline'): Element {
    let elmt;
    switch (name) {
        case 'InlineBlock':
            elmt = document.createElement('span');
            Utils.setStyle(elmt, {display: 'inline-block', position: 'relative'});
            break;
        default:
            elmt = document.createElement(type || 'div');
    }
    return wrapElement(memloss, elmt, alias);
}

function extendFunctions(memloss: MemLoss, elmt: HTMLElement){
    const bindDataSetName ="_" + uuid.v1();
    elmt[bindDataSetName] = {};
    return {
        set: function(name: string, data: any){
            elmt[bindDataSetName][name] = data;
        },
        get: function(name: string): any{
            return elmt[bindDataSetName][name];
        },
        getType: function(): string{
            const type = elmt.getAttribute('data-mem-loss-type');
            if(!type) throw new Error('unset type for ' + elmt);
            return type;
        },
        setWidth: function (width: number) {
            Utils.setStyle(elmt, { width: width});
            memloss.eventManager.triggleEvent(
                `${this.getType().toUpperCase()}_WIDTH_CHANGE`,
                `${this.getType().toUpperCase()}_SIZE_CHANGE`
            );
        },
        setHeight: function (height: number) {
            Utils.setStyle(elmt, { height: height});
            memloss.eventManager.triggleEvent(
                `${this.getType().toUpperCase()}_HEIGHT_CHANGE`,
                `${this.getType().toUpperCase()}_SIZE_CHANGE`
            );
        },
        setTop: function (top: number) {
            Utils.setStyle(elmt, { top: top});
            memloss.eventManager.triggleEvent(
                `${this.getType().toUpperCase()}_TOP_CHANGE`,
                `${this.getType().toUpperCase()}_POSITION_CHANGE`
            );
        },
        setLeft: function (left: number) {
            Utils.setStyle(elmt, { left: left});
            memloss.eventManager.triggleEvent(
                `${this.getType().toUpperCase()}_LEFT_CHANGE`,
                `${this.getType().toUpperCase()}_POSITION_CHANGE`
            );
        },
        setStyle: function (style: Object) {
            Utils.setStyle(elmt, style);
        },
        getInfo: function (consumer?: (info: ElementInfo) => void) {
            return Utils.getElementInfo(elmt, consumer);
        },
        addClass: function (c: string) {
            Utils.addClass(elmt, c);
        }
    }
}

export interface NodeListElement extends Element{
    content: Element
    scrollPage: ScrollPage
}

export interface EditorFrameElement extends Element{
    editorWindowsContainer: Element
}

export interface SidePadElement extends Element{
    sidePadResizingBar: Element;
}