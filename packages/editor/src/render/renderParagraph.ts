import { BlockType } from "../render";
import { createElement, getType } from "../utils";
import { Utils } from "utils";
import { renderAttachment } from "./renderAttachment";
import { renderCodeOpen } from "./renderCodeOpen";
const katex = require('katex');

interface Style {
    [index: number]: [string, number]
}

interface TextType extends BlockType {
    style?: Style
}

export function setUnitBlockType(node: HTMLElement, type: string, value: string) {
    node.setAttribute('data-unit-block-type', type);
    node.setAttribute('data-unit-block-value', value);
}

export function getUnitBlockType(node: HTMLElement) {
    return {
        type: node.getAttribute('data-unit-block-type'),
        value: node.getAttribute('data-unit-block-value'),
    }
}


export function setLineValue(node: HTMLElement, value: string) {
    if (getType(node) !== 'paragraph-line') throw new Error('错误的类型');
    node['memloss-text'] = value;
}

export function getLineValue(node: HTMLElement) {
    if (getType(node) !== 'paragraph-line') throw new Error('错误的类型');
    return node['memloss-text'];
}

export function setStartPosi(node: HTMLElement, startPosi: number): void {
    switch (getType(node)) {
        case 'text': case 'unit-block': break;
        default: throw new Error('错误的类型');
    }
    node['memloss-start-posi'] = startPosi;
}

export function getStartPosi(node: HTMLElement): number {
    switch (getType(node)) {
        case 'text': case 'unit-block': break;
        default: throw new Error('错误的类型');
    }
    return node['memloss-start-posi'];
}

export function renderParagraph(textBlock: TextType, viewLines: HTMLElement) {
    const paragraph = createElement('paragraph');
    viewLines.appendChild(paragraph);
    let line: HTMLElement | undefined = undefined;

    const paragraphInfo = Utils.getElementInfo(paragraph);
    let lessStr = textBlock.content;
    while (lessStr) {
        if (!line) {
            line = createElement('paragraph-line');
            paragraph.appendChild(line);
        }
        lessStr = renderTextInLine(lessStr, line, paragraphInfo.innerWidth);
        line = undefined;
    }

}


export function renderTextInLine(str: string, style: Style, styleOffset: number, container: HTMLElement, maxWdith: number): string {
    Utils.setStyle(container, { width: 'fit-content' });
    let ans = '';
    let unit: HTMLElement | undefined = undefined;
    for (let i = 0; i < str.length; i++) {
        if(style[i]){
            unit = createElement('text');
            unit.style.cssText = style[i][0];
            
        }

        const { nextPosition, unitBlock, type, value } = findUnitBlock(str, i);
        if (unitBlock) {
            unit = createElement('unit-block');
            container.appendChild(unit);
            setUnitBlockType(unit, type, value);
            setStartPosi(unit, i);
            switch (type) {
                case 'formula':
                    Utils.setStyle(unit, { cursor: 'pointer' });
                    katex.render(value, unit, { throwOnError: false });
                    break;
                case 'attachment':
                    renderAttachment(value, unit);
                    break;
                case 'code':
                    renderCodeOpen(value, unit);
                    break;
            }

            const containerInfo = Utils.getElementInfo(container);
            if (containerInfo.width > maxWdith) {
                container.removeChild(unit);
                ans = str.substring(i, str.length);
                break;
            }
            else {
                i = nextPosition;
                unit = undefined;
            }
        }
        else {
            if (!unit) {
                unit = createElement('text');
                setStartPosi(unit, i);
                container.appendChild(unit);
            }
            unit.innerText += str[i];

            const containerInfo = Utils.getElementInfo(container);
            if (containerInfo.width > maxWdith) {
                const text = unit.innerText;
                unit.innerText = text.substring(0, text.length - 1);

                if (!unit.innerText || unit.innerText === '') {
                    container.removeChild(unit);
                }
                ans = str.substring(i, str.length);
                break;
            }
        }
    }
    Utils.setStyle(container, { width: 'auto' });
    setLineValue(container, str.replace(ans, ''));
    return ans;
}

function findUnitBlock(str: string, position: number) {
    const c = str[position];
    let unitStr = undefined;
    const start = position;
    if (c === '[' && position + 1 < str.length && str[position + 1] === '[') {
        for (; position < str.length && position + 1 < str.length; position++) {
            if (str[position] === ']' && str[position + 1] === ']') {
                unitStr = str.substring(start, position + 2);
                break;
            }
        }
    }

    const ans = {
        nextPosition: start,
        unitBlock: '',
        type: '',
        value: ''
    }
    if (unitStr) {
        ans.nextPosition = position + 1;
        ans.unitBlock = unitStr;
        /\[\[(\S+)\(([\S\s]+)\)\]\]/.test(<string>unitStr);
        ans.type = RegExp.$1;
        ans.value = RegExp.$2;
    }
    return ans;
}