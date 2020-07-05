import { MemLoss } from "./MemLoss";
import { Utils, ElementInfo } from 'utils';
import { renderListFactory } from "./renderNodeList";

export interface Element extends HTMLElement {
    setWidth(): void;
    setHeight(): void;
    setTop(): void;
    setLeft(): void;
    setStyle(style: Object): void;
    getInfo(consumer?: (info: ElementInfo) => void): ElementInfo;
    addClass(c: string): void;
}

export interface InlineBlock extends Element {
    
}

export interface NodeListPad extends Element {
    getNodeList(): Element;
    renderList(data: NodeList): void;
}

export interface FunctionMenu extends Element {

}

export interface OpendPages extends Element {

}


interface ElementTypeMap {
    "NodeListPad": NodeListPad,
    "FunctionMenu": FunctionMenu,
    "OpendPages": OpendPages,
    "InlineBlock": InlineBlock,
}


export function wrapElement<T extends keyof ElementTypeMap, K extends Element>(memloss: MemLoss, elmt: HTMLElement, alias: string, name?: T): K {
    for (let key in extendFunctions) {
        elmt[key] = extendFunctions[key];
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
    switch(name){
        case 'InlineBlock':
            elmt = document.createElement('span');
            break;
        default:
            elmt = document.createElement(type || 'div');
    }
    return wrapElement(memloss, elmt, alias, name);
}

const extendFunctions = {
    setWidth: function () {
        const self = <HTMLElement><unknown>this;
        console.log(self);
    },
    setHeight: function () {
        console.log(this);
    },
    setTop: function () {
        console.log(this);
    },
    setLeft: function () {
        console.log(this);
    },
    setStyle: function (style: Object) {
        const self = <HTMLElement><unknown>this;
        Utils.setStyle(self, style);
    },
    getInfo: function (consumer?: (info: ElementInfo) => void) {
        const self = <HTMLElement><unknown>this;
        return Utils.getElementInfo(self, consumer);
    },
    addClass: function (c: string) {
        const self = <HTMLElement><unknown>this;
        Utils.addClass(self, c);
    }
}

function extendSpecialFunctions<T extends keyof ElementTypeMap>(memloss: MemLoss, elmt: HTMLElement, name: T){
    switch(name){
        case 'NodeListPad':
            const nodeList = createElement(memloss, 'nodeList');
            elmt.appendChild(nodeList);
            elmt['getNodeList'] = function(): Element{
                return nodeList;
            }
            elmt['renderList'] = renderListFactory(memloss, elmt);
            break;
        case 'InlineBlock':
            Utils.setStyle(elmt, {
                display: 'inline-block',
                position: 'relative'
            })
            break;
    }
}