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
}