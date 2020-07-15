import { BlockType } from "../render";
import { createElement, getType } from "../utils";
import { Utils } from "utils";
import { renderAttachment } from "./renderAttachment";
import { renderCodeOpen } from "./renderCodeOpen";
import { Constants } from "../Constants";

/// <reference path="./katex.d.ts"/>
import katex from 'katex';


declare type Style = {
    [index: string]: string
}
declare type StyleList = Array<[number, number, Style]>;

declare type RenderContext = {
    str: string,
    strIndex: number,
    unit: HTMLElement | undefined,
    maxWidth: number,
    line: HTMLElement,
    sortedRanges: Array<[number, number]>,
    styleMap: Map<[number, number], Style>,
    exceed: boolean,
    renderFinish: boolean,
}

interface TextType extends BlockType {
    styleList?: StyleList
    placeholder?: {
        styleList?: StyleList
        content: string
    }
}

export function setUnitBlockType(node: HTMLElement, type: string, value: string) {
    node.setAttribute(Constants.props.DATA_UNIT_BLOCK_TYPE, type);
    node.setAttribute(Constants.props.DATA_UNIT_BLOCK_VALUE, value);
}

export function getUnitBlockType(node: HTMLElement) {
    return {
        type: node.getAttribute(Constants.props.DATA_UNIT_BLOCK_TYPE),
        value: node.getAttribute(Constants.props.DATA_UNIT_BLOCK_VALUE),
    }
}

export function renderParagraph(textBlock: TextType, viewLines: HTMLElement) {
    const paragraph = createElement('paragraph');
    viewLines.appendChild(paragraph);

    paragraph[Constants.props.PARAGRAPH_PLACEHOLDE] = textBlock.placeholder;

    appendLineToParagraph(textBlock, paragraph);
    renderPlaceHolder(textBlock, paragraph);
}

export function renderPlaceHolder(textBlock: TextType, paragraph: HTMLElement) {
    const paragraphInfo = Utils.getElementInfo(paragraph);
    const placeholder = textBlock.placeholder;
    if (paragraph.childElementCount === 0) {
        if (!placeholder) {
            const line = createElement('paragraph-line');
            line[Constants.props.LINE_IS_PLACEHOLDER] = true;
            paragraph.appendChild(line);
            Utils.setStyle(line, { width: 'auto' });
            const text = createElement('text');
            line.appendChild(text);
            Utils.setStyle(text, {
                height: Utils.getStrPx(Constants.WIDTH_BASE_CHAR, text).height,
                width: 1
            })
        }
        else {
            let offset = 0;
            const sortedRanges = new Array<[number, number]>();
            const styleMap = new Map<[number, number], Style>();
            (placeholder.styleList || [[0, Number.MAX_VALUE, { color: 'grey' }]]).forEach(item => {
                const range: [number, number] = [item[0], item[1]];
                sortedRanges.push(range);
                styleMap.set(range, item[2]);
            });
            while (offset < placeholder.content.length) {
                const line = createElement('paragraph-line');
                line[Constants.props.LINE_IS_PLACEHOLDER] = true;
                paragraph.appendChild(line);

                offset += renderElementsInLine(
                    placeholder.content,
                    sortedRanges,
                    styleMap,
                    offset,
                    line,
                    paragraphInfo.innerWidth,
                    [renderText]
                );
            }
        }
    }
}

export function appendLineToParagraph(textBlock: TextType, paragraph: HTMLElement) {
    let line: HTMLElement | undefined = undefined;

    const paragraphInfo = Utils.getElementInfo(paragraph);
    let offset = 0;
    const sortedRanges = new Array<[number, number]>();
    const styleMap = new Map<[number, number], Style>();
    (textBlock.styleList || []).forEach(item => {
        const range: [number, number] = [item[0], item[1]];
        sortedRanges.push(range);
        styleMap.set(range, item[2]);
    });

    while (offset < textBlock.content.length) {
        line = createElement('paragraph-line');
        paragraph.appendChild(line);

        offset += renderElementsInLine(
            textBlock.content,
            sortedRanges,
            styleMap,
            offset,
            line,
            paragraphInfo.innerWidth,
            [renderText, renderUnitBlock]
        );
    }
}

export function renderElementsInLine(
    str: string,
    sortedRanges: Array<[number, number]>,
    styleMap: Map<[number, number], Style>,
    startOffset: number,
    line: HTMLElement,
    maxWdith: number,
    renders: Array<(context: RenderContext) => void>): number {

    Utils.setStyle(line, { width: 'fit-content' });

    const context: RenderContext = {
        str: str,
        strIndex: startOffset,
        unit: undefined,
        maxWidth: maxWdith,
        line: line,
        exceed: false,
        renderFinish: false,
        sortedRanges: sortedRanges,
        styleMap: styleMap,
    }

    while (!context.renderFinish && !context.exceed) {
        renders.forEach(render => {
            startRender(context, render);
        })
    }

    Utils.setStyle(line, { width: 'auto' });

    return context.strIndex - startOffset;
}

function startRender(context: RenderContext, render: (context: RenderContext) => void) {
    if (context.renderFinish || context.exceed) return;

    if (context.strIndex >= context.str.length) {
        context.renderFinish = true;
        return;
    }

    render(context);
}

function renderText(context: RenderContext): void {
    const { foundRange, nearestNextRange } = Utils.findInWhichRange(context.sortedRanges, context.strIndex);

    const style = foundRange ? context.styleMap.get(foundRange) : undefined;

    context.unit = createElement('text');
    context.line.appendChild(context.unit);
    if (style) Utils.setStyle(context.unit, style);

    while (context.strIndex < context.str.length) {
        if (findUnitBlock(context.str, context.strIndex).unitBlock) {
            return;
        }

        if (foundRange && context.strIndex >= foundRange[0] + foundRange[1]) {
            context.unit = undefined;
            return;
        }
        if (nearestNextRange && context.strIndex >= nearestNextRange[0]) {
            context.unit = undefined;
            return;
        }

        context.unit.innerText += context.str[context.strIndex];
        const lineInfo = Utils.getElementInfo(context.line);

        if (lineInfo.width > context.maxWidth) {
            const text = context.unit.innerText;
            context.unit.innerText = text.substring(0, text.length - 1);
            if (!context.unit.innerText || context.unit.innerText === '') {
                context.line.removeChild(context.unit);
            }
            context.exceed = true;
            context.unit = undefined;
            return;
        }

        context.strIndex += 1;
    }

    context.unit = undefined;
    context.renderFinish = true;
}

function renderUnitBlock(context: RenderContext): void {
    const { nextPosition, unitBlock, type, value } = findUnitBlock(context.str, context.strIndex);
    if (!unitBlock) return;

    context.unit = createElement('unit-block');
    context.line.appendChild(context.unit);

    const { foundRange, nearestNextRange } = Utils.findInWhichRange(context.sortedRanges, context.strIndex);
    const style = foundRange ? context.styleMap.get(foundRange) : undefined;

    if (style) Utils.setStyle(context.unit, style);
    setUnitBlockType(context.unit, type, value);
    switch (type) {
        case 'formula':
            Utils.setStyle(context.unit, { cursor: 'pointer' });
            katex.render(value, context.unit, { throwOnError: false });
            break;
        case 'attachment':
            renderAttachment(value, context.unit);
            break;
        case 'code':
            renderCodeOpen(value, context.unit);
            break;
    }

    const lineInfo = Utils.getElementInfo(context.line);
    if (lineInfo.width > context.maxWidth) {
        context.line.removeChild(context.unit);
        context.exceed = true;
    }
    else {
        context.strIndex = nextPosition;
    }
    context.unit = undefined;
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
        ans.nextPosition = position + 2;
        ans.unitBlock = unitStr;
        /\[\[(\S+)\(([\S\s]+)\)\]\]/.test(<string>unitStr);
        ans.type = RegExp.$1;
        ans.value = RegExp.$2;
    }
    return ans;
}