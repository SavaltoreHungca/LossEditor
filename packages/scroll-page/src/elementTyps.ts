import { ScrollPage } from './ScrollPage';
import { $$, ElementInfo, extend } from 'utils';

export type ElementTypsMap = {
    'buttom-scrollbar': ButtomScrollBar
    'container': Container
    'window': Window
    'page': Page
    'right-scrollbar': RightScrollBar
    'top-shallow': TopShallow
    'right-shallow': RightShallow
    'buttom-slider': ButtomSlider
    'right-slider': RightSlider
    'content': Content
}

interface Element extends HTMLElement {
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

export interface ButtomScrollBar extends Element { }
export interface Container extends Element { }
export interface Window extends Element { }
export interface Page extends Element { }
export interface RightScrollBar extends Element { }
export interface TopShallow extends Element { }
export interface RightShallow extends Element { }
export interface ButtomSlider extends Element {
    dragging: boolean
    lightenColor(): void
    darkenColor(): void
}
export interface RightSlider extends Element {
    dragging: boolean
    lightenColor(): void
    darkenColor(): void
}
export interface Content extends Element { }

export function buttomScrollBarExt(sp: ScrollPage) {
    return (ele: HTMLElement) => {
        return {
            getType: () => 'ButtomScrollBar'
        }
    }
}
export function containerExt(sp: ScrollPage) {
    return (ele: HTMLElement) => {
        return {
            getType: () => 'Container'
        }
    }
}
export function windowExt(sp: ScrollPage) {
    return (ele: HTMLElement) => {
        return {
            getType: () => 'Window'
        }
    }
}
export function pageExt(sp: ScrollPage) {
    return (ele: HTMLElement) => {
        return {
            getType: () => 'Page'
        }
    }
}
export function rightScrollBarExt(sp: ScrollPage) {
    return (ele: HTMLElement) => {
        return {
            getType: () => 'RightScrollBar'
        }
    }
}
export function topShallowExt(sp: ScrollPage) {
    return (ele: HTMLElement) => {
        return {
            getType: () => 'TopShallow'
        }
    }
}
export function rightShallowExt(sp: ScrollPage) {
    return (ele: HTMLElement) => {
        return {
            getType: () => 'RightShallow'
        }
    }
}
export function buttomSliderExt(sp: ScrollPage) {
    return (ele: HTMLElement) => {
        const sf = <Element>ele;
        return {
            isDarken: false,
            lightenColor: function () {
                this.isDarken = false;
                $$.removeStyle(sf, 'background');
            },
            darkenColor: function () {
                if (!this.isDarken) {
                    sf.setStyle({
                        background: 'hsla(0,0%,39%,.7)'
                    })
                    this.isDarken = true;
                }
            },
            dragging: false,
            getType: () => 'ButtomSlider'
        }
    }
}
export function rightSliderExt(sp: ScrollPage) {
    return (ele: HTMLElement) => {
        const sf = <Element>ele;
        return {
            isDarken: false,
            lightenColor: function () {
                this.isDarken = false;
                $$.removeStyle(sf, 'background')
            },
            darkenColor: function () {
                if (!this.isDarken) {
                    sf.setStyle({
                        background: 'hsla(0,0%,39%,.7)'
                    })
                    this.isDarken = true;
                }
            },
            dragging: false,
            getType: () => 'RightSlider'
        }
    }
}
export function contentExt(sp: ScrollPage) {
    return (ele: HTMLElement) => {
        return {
            getType: () => 'Content'
        }
    }
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

export function creEle<K extends keyof ElementTypsMap>(sp: ScrollPage, type: K, ele?: HTMLElement): ElementTypsMap[K] {
    switch (type) {
        case 'container':
            return extend($$.creEle('block'), [eleExt(sp, type), containerExt(sp)]);
        case 'content':
            if (!ele) throw new Error();
            return extend(ele, [eleExt(sp, type), contentExt(sp)]);
        case 'window':
            if (!ele) throw new Error();
            return extend($$.wrapEle('block', ele), [eleExt(sp, type), windowExt(sp)]);
        case 'page':
            if (!ele) throw new Error();
            return extend($$.wrapEle('absolute', ele), [eleExt(sp, type), pageExt(sp)]);
        case 'right-scrollbar':
            if (!ele) throw new Error();
            return extend($$.wrapEle('absolute', ele), [eleExt(sp, type), rightScrollBarExt(sp)]);
        case 'right-slider':
            if (!ele) throw new Error();
            return extend($$.wrapEle('absolute', ele), [eleExt(sp, type), rightSliderExt(sp)]);
        case 'buttom-scrollbar':
            if (!ele) throw new Error();
            return extend($$.wrapEle('absolute', ele), [eleExt(sp, type), buttomScrollBarExt(sp)]);
        case 'buttom-slider':
            if (!ele) throw new Error();
            return extend($$.wrapEle('absolute', ele), [eleExt(sp, type), buttomSliderExt(sp)]);
        case 'top-shallow':
            if (!ele) throw new Error();
            return extend($$.wrapEle('absolute', ele), [eleExt(sp, type), topShallowExt(sp)]);
        case 'right-shallow':
            if (!ele) throw new Error();
            return extend($$.wrapEle('absolute', ele), [eleExt(sp, type), rightShallowExt(sp)]);
    }
    throw new Error();
}