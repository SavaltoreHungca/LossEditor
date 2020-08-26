import { MemLoss } from "../MemLoss";
import { $$, ElementInfo } from 'utils';
import { ElementTypsMap } from "./elementTypes";

const bindDataSetName = $$.randmonId();

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

export function elementExt<K extends keyof ElementTypsMap>(memloss: MemLoss, type: K){
    return (elmt: HTMLElement) => {
        elmt.setAttribute('data-mem-loss-type', type);

        return {
            set: function (name: string, data: any) {
                elmt[bindDataSetName][name] = data;
            },
            get: function (name: string): any {
                return elmt[bindDataSetName][name];
            },
            getType: function (): string {
                return type;
            },
            setWidth: function (width: number) {
                $$.setStyle(elmt, { width: width });
                memloss.eventManager.triggleEvent(
                    `${this.getType().toUpperCase()}_WIDTH_CHANGE`,
                    `${this.getType().toUpperCase()}_SIZE_CHANGE`
                );
            },
            setHeight: function (height: number) {
                $$.setStyle(elmt, { height: height });
                memloss.eventManager.triggleEvent(
                    `${this.getType().toUpperCase()}_HEIGHT_CHANGE`,
                    `${this.getType().toUpperCase()}_SIZE_CHANGE`
                );
            },
            setTop: function (top: number) {
                $$.setStyle(elmt, { top: top });
                memloss.eventManager.triggleEvent(
                    `${this.getType().toUpperCase()}_TOP_CHANGE`,
                    `${this.getType().toUpperCase()}_POSITION_CHANGE`
                );
            },
            setLeft: function (left: number) {
                $$.setStyle(elmt, { left: left });
                memloss.eventManager.triggleEvent(
                    `${this.getType().toUpperCase()}_LEFT_CHANGE`,
                    `${this.getType().toUpperCase()}_POSITION_CHANGE`
                );
            },
            setStyle: function (style: Object) {
                $$.setStyle(elmt, style);
            },
            getInfo: function (consumer?: (info: ElementInfo) => void) {
                return $$.getElementInfo(elmt, consumer);
            },
            addClass: function (c: string) {
                $$.addClass(elmt, c);
            }
        }
    }
}