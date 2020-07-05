import { MemLoss } from "./MemLoss";
import { Utils, ElementInfo } from 'utils';
import { renderListFactory } from "./renderNodeList";
import { Editor } from 'editor';
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

export interface InlineBlock extends Element {

}

export interface NodeListPad extends Element {
    nodeList: Element;
    addNewPageButton: Element;
    renderList(data: NodeList): void;
}

export interface FunctionMenu extends Element {

}

export interface OpendPages extends Element {

}

export interface EditorFrame extends Element {
    topBar: Element;
    editorWindowsContainer: Element;
    editorWindows: Array<EditorWindow>;
    bottomPad: Element;
}

export interface EditorWindow extends Element {
    editor: Editor;
    render(): void;
}


interface ElementTypeMap {
    "NodeListPad": NodeListPad
    "FunctionMenu": FunctionMenu
    "OpendPages": OpendPages
    "InlineBlock": InlineBlock
    "EditorFrame": EditorFrame
    "EditorWindow": EditorWindow
}


export function wrapElement<T extends keyof ElementTypeMap, K extends Element>(memloss: MemLoss, elmt: HTMLElement, alias: string, name?: T): K {
    const functions = extendFunctions(memloss, elmt);
    for (let key in functions) {
        elmt[key] = functions[key];
    }
    elmt.setAttribute("data-mem-loss-type", alias);
    if (name) {
        extendSpecialFunctions(memloss, elmt, name);
        return <K>elmt;
    }
    return <K>elmt;
}

export function createElement<T extends keyof ElementTypeMap, K extends Element>(memloss: MemLoss, alias: string, name?: T, type?: string): K {
    let elmt;
    switch (name) {
        case 'InlineBlock':
            elmt = document.createElement('span');
            break;
        default:
            elmt = document.createElement(type || 'div');
    }
    return wrapElement(memloss, elmt, alias, name);
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

function extendSpecialFunctions<T extends keyof ElementTypeMap>(memloss: MemLoss, elmt: HTMLElement, name: T) {
    switch (name) {
        case 'NodeListPad':
            const nodeList = createElement(memloss, 'nodeList');
            const addNewPageButton = createElement(memloss, 'addNewPageButton');
            elmt.appendChild(nodeList);
            elmt.appendChild(addNewPageButton);
            elmt['nodeList'] = nodeList;
            elmt['renderList'] = renderListFactory(memloss, elmt);
            elmt['addNewPageButton'] = addNewPageButton;
            break;
        case 'InlineBlock':
            Utils.setStyle(elmt, { display: 'inline-block', position: 'relative' })
            break;
        case 'EditorFrame':
            const topbar = createElement(memloss, 'topbar');
            const editorWindowsContainer = createElement(memloss, 'editorWindowsContainer');
            const bottomPad = createElement(memloss, 'bottomPad');
            elmt.appendChild(topbar);
            elmt.appendChild(editorWindowsContainer);
            elmt.appendChild(bottomPad);
            elmt['topBar'] = topbar;
            elmt['editorWindowsContainer'] = editorWindowsContainer;
            elmt['editorWindows'] = [];
            elmt['bottomPad'] = bottomPad;
            break;
    }
}