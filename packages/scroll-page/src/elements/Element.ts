import { ElementInfo, $$ } from "utils";
import { ElementTypsMap } from "./elementTyps";
import { ScrollPage } from "../ScrollPage";

export interface Element extends HTMLElement {
    setWidth(wdith: string | number): void
    setHeight(height: string | number): void
    setLeft(left: string | number): void
    setRight(right: string | number): void
    setTop(top: string | number): void
    setBottom(bottom: string | number): void
    getType(): string
    setStyle(style: Object): void
    getInlineCssStyle(): void
    getCssStyle(): CSSStyleDeclaration
    getInfo(): ElementInfo
    visible(): boolean
    show(): void
    cancelDisappear(): void
    disappear(delay?: number, callback?: Function): void
    setRole(roleName: string): void
    addClass(c: string): void
    addDragEvent(callback: Function): void
}

export function eleExt<K extends keyof ElementTypsMap>(sp: ScrollPage, type: K) {
    return (ele: HTMLElement) => {
        ele.setAttribute('data-scrollpage-type', type)
        return {
            DISPEAR_ID: $$.randmonId(),
            setWidth: function (wdith: string | number) {
                this.setStyle({ width: wdith });
                sp.eventManager.triggleEvent(`${this.getType().toUpperCase()}_WIDTH_CHANGE`);
            },
            setHeight: function (height: string | number) {
                this.setStyle({ height: height });
                sp.eventManager.triggleEvent(`${this.getType().toUpperCase()}_HEIGHT_CHANGE`);
            },
            setLeft: function (left: string | number) {
                this.setStyle({ left: left });
                sp.eventManager.triggleEvent(`${this.getType().toUpperCase()}_LEFT_CHANGE`);
            },
            setRight: function (right: string | number) {
                this.setStyle({ right: right });
                sp.eventManager.triggleEvent(`${this.getType().toUpperCase()}_RIGHT_CHANGE`);
            },
            setTop: function (top: string | number) {
                this.setStyle({ top: top });
                sp.eventManager.triggleEvent(`${this.getType().toUpperCase()}_TOP_CHANGE`);
            },
            setBottom: function (bottom: string | number) {
                this.setStyle({ bottom: bottom });
                sp.eventManager.triggleEvent(`${this.getType().toUpperCase()}_BUTTOM_CHANGE`);
            },
            getType: () => {
                return 'UNSET'
            },
            setStyle: (style: Object) => {
                $$.setStyle(ele, style);
            },
            getInlineCssStyle: () => {
                return $$.getInlineCssStyle(ele);
            },
            getCssStyle: (): CSSStyleDeclaration => {
                return ele.style;
            },
            addDragEvent: (callback: Function) => {
                $$.addDragEvent(ele, callback);
            },
            getInfo: () => {
                return $$.getElementInfo(ele);
            },
            visible: function () {
                return this.getCssStyle().visibility !== 'hidden';
            },
            show: function () {
                this.cancelDisappear();
                this.setStyle({ visibility: 'visible' });
            },
            disappear: function (delay?: number, callback?: Function) {
                this.cancelDisappear();
                if (delay) {
                    $$.setLastTimeout(this.DISPEAR_ID, () => {
                        this.setStyle({ visibility: 'hidden' });
                        if (callback) callback();
                    }, delay)
                } else {
                    this.setStyle({ visibility: 'hidden' });
                    if (callback) callback();
                }
            },
            cancelDisappear: function () {
                $$.cancelLastTimeout(this.DISPEAR_ID);
            },
            setRole: function (roleName: string) {
                ele.setAttribute("data-role", roleName);
            },
            addClass: function (c: string) {
                $$.addClass(ele, c);
            }
        }
    }
}