export interface ElementInfo {
    width: number;
    height: number;
    top: number;
    left: number;
    innerWidth: number;
    innerHeight: number;
}

export class Utils {
    static setStyle(element: HTMLElement, style: Object) {
        let getCssText = (style: Object) => {
            let ans = "";
            if (!this.isObject(style)) return "";
            for (let name in style) {
                ans += name + ':' + style[name] + ';';
            }
            return ans;
        }

        let getCssStyle = (cssText: String) => {
            if (cssText) {
                let ans = {};
                let styles = cssText.split(';').filter(Boolean);
                for (let style of styles) {
                    let [name, value] = style.split(':');
                    ans[name] = value;
                }
                return ans;
            }
            return {}
        }

        if (element.style.cssText) {
            let beforeStyle = getCssStyle(element.style.cssText)
            for (let name in style) {
                if (style[name] === "") {
                    delete beforeStyle[name];
                } else {
                    beforeStyle[name] = style[name];
                }
            }
            element.style.cssText = getCssText(beforeStyle);
        } else {
            if (!this.isObject(style)) return;
            element.style.cssText = getCssText(style)
        }
    }

    static getInlineCssStyle(element: HTMLElement) {
        let cssText = element.style.cssText;
        if (cssText) {
            let ans = {};
            let styles = cssText.split(';').filter(Boolean);
            for (let style of styles) {
                let [name, value] = style.split(':');
                ans[name] = value;
            }
            return ans;
        }
    }

    static getElementInfo(element: HTMLElement) {
        let ans: ElementInfo = {
            width: element.offsetWidth,
            height: element.offsetHeight,
            top: element.offsetTop,
            left: element.offsetLeft,
            innerWidth: element.offsetWidth,
            innerHeight: element.offsetHeight
        };

        if (element.style.borderLeftWidth) {
            ans.innerWidth -= parseInt(element.style.borderLeftWidth.substring(0, 1));
        }
        if (element.style.borderRightWidth) {
            ans.innerWidth -= parseInt(element.style.borderRightWidth.substring(0, 1));
        }
        if (element.style.borderTopWidth) {
            ans.innerHeight -= parseInt(element.style.borderTopWidth.substring(0, 1));
        }
        if (element.style.borderBottomWidth) {
            ans.innerHeight -= parseInt(element.style.borderBottomWidth.substring(0, 1));
        }
        return ans;
    }

    static isObject(obj: any) {
        return !this.isUndfined(obj) && typeof obj === 'object';
    }

    static isEmptyStr(str: any) {
        return str === "" || this.isUndfined(str);
    }

    static isUndfined(obj: any) {
        return obj === null || typeof obj === 'undefined';
    }

    static isArray(obj: any) {
        return Array.isArray(obj);
    }

    static isFunction(f: any) {
        return typeof f === 'function';
    }

    static in(obj: any, array: any) {
        if (this.isObject(array)) {
            for (let item of array) {
                if (obj === item) {
                    return true;
                }
            }
        }
        return false;
    }
    static get(obj: any, propName: string): any {
        return obj[propName];
    }
    static getMousePositionInElement(elemt: HTMLElement, event: MouseEvent): {
        left: number,
        top: number,
        bottom: number,
        right: number,
        leaved: boolean
    } {
        const { clientX, clientY } = event;
        const eleInfo = this.getElementInfo(elemt);
        const position = elemt.getBoundingClientRect();
        const left = clientX - position.x;
        const top = clientY - position.y;
        const bottom = eleInfo.innerHeight - top;
        const right = eleInfo.innerWidth - left;
        let leaved = left < 0 || top < 0 || bottom < 0 || right < 0;
        return {
            left: left,
            top: top,
            bottom: bottom,
            right: right,
            leaved: leaved
        }
    }
    static getComputedStyle(node: HTMLElement, attr: string) {
        if (typeof getComputedStyle != 'undefined') {
            let value: any = getComputedStyle(node, null).getPropertyValue(attr);
            return attr == 'opacity' ? value * 100 : value; //兼容不透明度，如果是不透明度，则返回整数方便计算
        } else if (typeof this.get(node, "currentStyle") != 'undefined') {
            if (attr == 'opacity') { //兼容不透明度
                return Number(this.get(node, "currentStyle").getAttribute('filter').match(/(?:opacity[=:])(\d+)/)[1]);
            } else {
                return this.get(node, "currentStyle").getAttribute(attr);
            }
        }
    }
    static getStrPx(str: string, container: HTMLElement) {
        const span = window.document.createElement("span");
        span.innerText = str;
        this.setStyle(span, { 
            "position": "fixed",
            "top": "0",
            "left": "0",
            "white-space": "pre",
            "z-index": "-9999",
            "font": this.getComputedStyle(container, "font"), 
            "visibility": "hidden",
            "display": "inline-block"
        });
        window.document.body.append(span);
        const textWidth = span.clientWidth;
        const ans = {
            width: span.clientWidth,
            height: span.clientHeight
        }
        span.parentElement?.removeChild(span);
        return ans;
    }
}