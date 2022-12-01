import { forInObject, isNil, stackPeek } from ".";

export interface ElementInfo {
    width: number;
    height: number;
    top: number;
    left: number;
    innerWidth: number;
    innerHeight: number;
    innerTop: number;
    innerLeft: number
}

interface RelativePostion {
    left: number;
    top: number;
    right: number;
    bottom: number;
    rightBoderLeft: number;
    bottomBorderLeft: number;
}

export class HtmlUtil {

    /**
     * 
     * @param ele 元素
     * @param str 
     * @param clearBefore 是否清除之前
     */
    static innerHtml(ele: Element, str: string, clearBefore?: boolean) {
        if (clearBefore) ele.innerHTML = '';
        str = str.trim();

        const stack = new Array<Node>();
        const ans = new Array<HTMLElement>();

        let inStartTag = false;
        for (let i = 0; i < str.length; i++) {
            if (isStartTarg(i, str)) {
                inStartTag = true;
                let data = '';
                while (++i && !isEnd(i, str)) {
                    data += str[i];
                }
                const node = new Node(data);
                stack.push(node)
            }
            else if (isEndTarg(i, str)) {
                while (!isEnd(i, str)) {
                    i++;
                }
                const node = <Node>stack.pop();
                if (stackPeek(stack)) {
                    const ele = node.htmlEle();
                    const parent = stackPeek(stack);
                    parent.htmlEle().appendChild(ele);
                }
                else {
                    inStartTag = false;
                    ans.push(node.htmlEle());
                }
            }
            else if (inStartTag && !isStartTarg(i, str)) {
                if (stackPeek(stack)) stackPeek(stack).innerText += str[i];
            }
        }

        ans.forEach(child => ele.appendChild(child));
    }

    static createStyleSheet(): CSSStyleSheet {
        const head = document.head || document.getElementsByTagName('head')[0];
        const style = document.createElement('style');
        style.type = 'text/css';
        head.appendChild(style);
        return style.sheet || style['styleSheet'];
    }

    static addStyleSheet(
        selector: string,
        rules: {[i: string]: string} | string,
        sheet?: CSSStyleSheet) {

        // 创建一个 style， 返回其 stylesheet 对象
        // 注意：IE6/7/8中使用 style.stylesheet，其它浏览器 style.sheet
        // 创建 stylesheet 对象
        if (isNil(sheet)) {
            sheet = this.createStyleSheet();
        }

        let ruleStr = '';
        if(typeof rules === 'string'){
            ruleStr = rules;
        } else {
            ruleStr = JSON.stringify(rules);
            ruleStr = ruleStr.replace(/"/g, '');
            ruleStr = ruleStr.replace(/,/g, ';');
            ruleStr = ruleStr.substring(1, ruleStr.length - 1) + ';';
        }

        if (sheet.insertRule) {
            const rule = selector + "{" + ruleStr + "}";
            sheet.insertRule(rule);
        } else if (sheet.addRule) {
            sheet.addRule(selector, ruleStr);
        }
    }

    static setStyle(element: HTMLElement, style: { [index: string]: string | number }) {
        for (let name in style) {
            switch (name) {
                case 'top': case 'left': case 'bottom': case 'right': case 'width': case 'height':
                case 'padding': case 'padding-left': case 'padding-top': case 'padding-right': case 'padding-bottom':
                case 'min-width': case 'max-width': case 'min-height': case 'max-height':
                    if (typeof style[name] === 'number') {
                        style[name] = style[name] + 'px';
                    }
                    break;
            }
        }

        if (element.style.cssText) {
            let beforeStyle = this.getInlineCssStyle(element)
            for (let name in style) {
                if (style[name] === '') {
                    delete beforeStyle[name];
                } else {
                    beforeStyle[name] = style[name];
                }
            }
            element.style.cssText = this.toCssText(beforeStyle);
        }
        else {
            element.style.cssText = this.toCssText(style)
        }
    }

    static getInlineCssStyle(elementOrCssText: HTMLElement | string): { [index: string]: string | number } {
        const cssText = typeof elementOrCssText === 'string' ? elementOrCssText
            : elementOrCssText.style.cssText;
        const ans = {};
        if (cssText) {
            const styles = cssText.split(';').filter(Boolean);
            for (const style of styles) {
                if (style.trim() === '') continue;
                const [name, value] = style.split(':');
                ans[name.trim()] = value.trim();
            }
        }
        return ans;
    }

    static toCssText(style: { [index: string]: string | number }): string {
        let ans = "";
        if (isNil(style)) return "";

        forInObject(style, name => {
            ans += name + ':' + style[name] + ';';
        })
        return ans;
    }

    static removeStyle(ele: HTMLElement, ...names: string[]) {
        const style = this.getInlineCssStyle(ele);
        for (const name of names) {
            delete style[name];
        }
        ele.style.cssText = this.toCssText(style);
        return style;
    }

    static getComputedStyle(node: Element, attr: string): string {
        if (typeof getComputedStyle != 'undefined') {
            let value: any = getComputedStyle(node, null).getPropertyValue(attr);
            return attr == 'opacity' ? value * 100 : value; //兼容不透明度，如果是不透明度，则返回整数方便计算
        } else if (typeof node['currentStyle'] != 'undefined') {
            if (attr == 'opacity') { //兼容不透明度
                return Number(node['currentStyle'].getAttribute('filter').match(/(?:opacity[=:])(\d+)/)[1]).toString();
            } else {
                return node['currentStyle'].getAttribute(attr);
            }
        }
        return '';
    }

    static getElementInfoBatch(consumer: (...info: ElementInfo[]) => void, ...elements: HTMLElement[]) {
        const infos: Array<ElementInfo> = new Array<ElementInfo>();
        for (let elemnt of elements) {
            infos.push(this.getElementInfo(elemnt));
        }
        consumer(...infos);
    }

    static getElementInfo(element: HTMLElement, consumer?: (info: ElementInfo) => void) {
        let ans: ElementInfo = {
            width: element.offsetWidth,
            height: element.offsetHeight,
            top: element.offsetTop,
            left: element.offsetLeft,
            innerWidth: element.offsetWidth,
            innerHeight: element.offsetHeight,
            innerTop: element.offsetTop,
            innerLeft: element.offsetLeft
        };

        if (element.style.borderLeftWidth) {
            ans.innerWidth -= parseInt(element.style.borderLeftWidth);
        }
        if (element.style.borderRightWidth) {
            ans.innerWidth -= parseInt(element.style.borderRightWidth);
        }
        if (element.style.borderTopWidth) {
            ans.innerHeight -= parseInt(element.style.borderTopWidth);
        }
        if (element.style.borderBottomWidth) {
            ans.innerHeight -= parseInt(element.style.borderBottomWidth);
        }

        if (element.style.paddingLeft) {
            ans.innerWidth -= parseInt(element.style.paddingLeft);
            ans.innerLeft += parseInt(element.style.paddingLeft);
            if (element.style.boxSizing === 'boder-box') {
                ans.innerLeft += parseInt(element.style.borderLeftWidth);
            }
        }
        if (element.style.paddingRight) {
            ans.innerWidth -= parseInt(element.style.paddingRight);
        }
        if (element.style.paddingTop) {
            ans.innerHeight -= parseInt(element.style.paddingTop);
            ans.innerTop += parseInt(element.style.paddingTop);
            if (element.style.boxSizing === 'boder-box') {
                ans.innerTop += parseInt(element.style.borderTopWidth);
            }
        }
        if (element.style.paddingBottom) {
            ans.innerHeight -= parseInt(element.style.paddingBottom);
        }
        if (consumer) {
            consumer(ans);
        }
        return ans;
    }

    static splitToSuitLength(container: HTMLElement, str: string) {
        const containerInfo = this.getElementInfo(container);
        if (str.length === 0 || this.getStrPx(str, container).width <= containerInfo.innerWidth) {
            return [str, ""];
        }
        let critical = str.length / 2;
        while (true) {
            const { width } = this.getStrPx(str.substring(0, critical), container);
            const accuracy = containerInfo.innerWidth - width;
            if (accuracy >= 0 && accuracy < 10) {
                return [str.substring(0, critical), str.substring(critical)]
            }
            if (width > containerInfo.innerWidth) {
                critical -= critical / 2;
            } else if (width < containerInfo.innerWidth) {
                critical += critical / 2;
            }
        }
    }

    static getStrPx(str: string, container: Element): { width: number, height: number } {
        const span = window.document.createElement("span");
        span.innerText = str;
        this.setStyle(span, {
            "position": "fixed",
            "top": "0",
            "left": "0",
            "white-space": "pre",
            "z-index": "-9999",
            "visibility": "hidden",
            "display": "inline-block",
            "font": this.getComputedStyle(container, "font"),
            "font-family": this.getComputedStyle(container, "font-family"),
            "font-weight": this.getComputedStyle(container, "font-weight"),
            "font-size": this.getComputedStyle(container, "font-size"),
            "font-feature-settings": this.getComputedStyle(container, "font-feature-settings"),
            "line-height": this.getComputedStyle(container, "line-height"),
            "letter-spacing": this.getComputedStyle(container, "letter-spacing"),
        });
        window.document.body.append(span);
        const ans = {
            width: span.clientWidth,
            height: span.clientHeight
        }
        span.parentElement!.removeChild(span);
        return ans;
    }

    static getRelativePosition(elemt: HTMLElement, parent: HTMLElement): RelativePostion {
        const originalElement = elemt;
        const ans = {
            left: 0, top: 0,
            right: 0, bottom: 0,
            rightBoderLeft: 0, bottomBorderLeft: 0,
        }
        while (elemt !== parent) {
            ans.left += elemt.offsetLeft;
            ans.top += elemt.offsetTop;
            elemt = <HTMLElement>elemt.offsetParent;
        }
        const parentInfo = this.getElementInfo(parent);
        const elemtInfo = this.getElementInfo(elemt);
        ans.bottom = parentInfo.innerHeight - ans.top - elemtInfo.height;
        ans.right = parentInfo.innerWidth - ans.left - elemtInfo.width;

        const originalElementInfo = this.getElementInfo(originalElement);
        ans.rightBoderLeft = ans.left + originalElementInfo.width;
        ans.bottomBorderLeft = ans.top + originalElementInfo.height;
        return ans;
    }

    /**
     * 为元素添加只执行一次的事件
     * @param elmt 
     * @param evtName 
     * @param listener 
     */
    static addExecuteOneEvt(elmt: Element, evtName: string, listener: (ev: Event) => void) {
        const l = (evnt: any) => {
            elmt.removeEventListener(evtName, l);
            listener(evnt);
        }
        elmt.addEventListener(evtName, l);
    }

    static addClass(elemt: HTMLElement, c: string) {
        elemt.className += " " + c;
    }

    static removeClass(elemt: HTMLElement, c: string) {
        if (elemt.className) {
            const classNames = elemt.className.split(/\s+/);
            let newClassName = '';
            classNames.forEach((it) => {
                if (it !== c) {
                    newClassName += ' ' + it;
                }
            })
            elemt.className = newClassName;
        }
    }
}



class Node {
    private data: string[] = [];
    innerText = '';
    ele: HTMLElement | undefined;

    constructor(data: string) {
        let started = false;
        let inStr = false;
        let item = '';
        for (let i = 0; i < data.length; i++) {
            if (!isBlank(i, data) && !started && !inStr) {
                started = true;
                item += data[i];
            }
            else if (isBlank(i, data) && !inStr && started) {
                started = false;
                this.data.push(item);
                item = '';
            }
            else if (data[i] === '"' && started && !inStr) {
                inStr = true;
            }
            else if (data[i] === '"' && inStr) {
                inStr = false;
            }
            else if (started) {
                item += data[i];
            }
        }
        if (item !== '') this.data.push(item);
    }

    htmlEle() {
        if (this.ele) return this.ele;
        this.ele = document.createElement(this.data[0]);
        const innerText = this.innerText.trim();
        if (innerText !== '') this.ele.innerText = innerText;

        for (let i = 1; i < this.data.length; i++) {
            const [key, value] = this.data[i].split('=');
            if (key === 'style') {
                HtmlUtil.setStyle(this.ele, HtmlUtil.getInlineCssStyle(value));
            }
            else if (key === 'id') {
                this.ele.id = value;
            }
            else {
                this.ele.setAttribute(key, value || '');
            }
        }

        return this.ele;
    }
}

function isStartTarg(i: number, str: string) {
    return str[i] === "<" && i + 1 < str.length && str[i + 1] !== '/';
}

function isEndTarg(i: number, str: string) {
    return str[i] === "<" && i + 1 < str.length && str[i + 1] === '/';
}

function isEnd(i: number, str: string) {
    return str[i] === '>';
}

function isBlank(i: number, str: string): boolean {
    return /\s/.test(str[i]);
}