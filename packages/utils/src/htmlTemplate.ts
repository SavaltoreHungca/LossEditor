import { $$ } from "./Utils";

export function innerHtml(ele: HTMLElement, str: string, clearBefore?: boolean) {
    if(clearBefore) ele.innerHTML = '';
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
            if ($$.stackPeek(stack)) {
                const ele = node.htmlEle();
                const parent = $$.stackPeek(stack);
                parent.htmlEle().appendChild(ele);
            }
            else {
                inStartTag = false;
                ans.push(node.htmlEle());
            }
        }
        else if (inStartTag && !isStartTarg(i, str)) {
            if ($$.stackPeek(stack)) $$.stackPeek(stack).innerText += str[i];
        }
    }

    ans.forEach(child => ele.appendChild(child));
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
                $$.setStyle(this.ele, $$.getInlineCssStyle(value));
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