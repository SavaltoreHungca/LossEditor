import { ScrollPage } from './ScrollPage';
import { $$, ElementInfo } from 'utils';
import Constants from './Constants';

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
    fadeOut(duration?: number): void
    cancelFadeOut(): void
    disappear(delay?: number, callback?: Function): void
    cancelLastTimeout(id: string): void
    setRole(roleName: string): void
    setAttribute(name: string, value?: string): void
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
            lightenColor: function () {
                sf.setStyle({
                    background: 'hsla(0,0%,39%,.4)'
                })
            },
            darkenColor: function () {
                sf.cancelLastTimeout(Constants.timeout.BUTTOM_SLIDER_FADE_TIMEOUT);
                sf.setStyle({
                    background: 'hsla(0,0%,39%,.7)'
                })
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
            lightenColor: function () {
                sf.setStyle({
                    background: 'hsla(0,0%,39%,.4)'
                })
            },
            darkenColor: function () {
                sf.cancelLastTimeout(Constants.timeout.RIGHT_SLIDER_FADE_TIMEOUT);
                sf.setStyle({
                    background: 'hsla(0,0%,39%,.7)'
                })
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

export function eleExt(sp: ScrollPage) {
    return (ele: HTMLElement) => {
        return {
            opacity: 1,
            initialOpacity: -1,
            fadeGradient: 0.1,
            fadeInterval: 100,
            fadeoutGoing: false,
            FADE_OUT_TIME_ID: $$.randmonId(),
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
                this.cancelFadeOut();
                this.setStyle({ visibility: 'visible' });
            },
            disappear: function (delay?: number, callback?: Function) {
                this.cancelDisappear();
                this.cancelFadeOut();
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
            fadeOut: function (duration?: number) {
                if (this.fadeoutGoing) return;
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
                    $$.setLastTimeout(this.FADE_OUT_TIME_ID, fadeFunc, this.fadeInterval);
                }
                this.fadeoutGoing = true;
                $$.setLastTimeout(this.FADE_OUT_TIME_ID, fadeFunc, this.fadeInterval);
            },
            cancelFadeOut: function () {
                if (this.fadeoutGoing) {
                    $$.cancelLastTimeout(this.FADE_OUT_TIME_ID);
                    if (this.initialOpacity !== -1) {
                        this.setStyle({
                            opacity: this.initialOpacity
                        })
                    }
                }
                this.fadeoutGoing = false;
            },
            setRole: function (roleName: string) {
                this.setAttribute("data-role", roleName);
            },
            setAttribute: function (name: string, value?: string) {
                if (!value) value = "";
                this.setAttribute(name, value);
            },
            addClass: function (c: string) {
                $$.addClass(ele, c);
            }
        }
    }
}