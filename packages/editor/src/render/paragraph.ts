import { Editor } from "../Editor";
import { Node } from "editor-core";

/// <reference path="./katex.d.ts"/>
import katex from 'katex';
import { Constants } from "../Constants";
import { $$ } from "utils";
import { indentationWrap } from "./indentationWrap";
import { mountChild } from "./mountChild";
import { Style, creEle} from "../elements/elementTypes";
import { Paragraph } from '../elements/Paragraph';
import { ParagraphLine } from '../elements/ParagraphLine';
import { Text } from '../elements/Text';
import { Inlineblock } from '../elements/Inlineblock';
import { UnitBlock } from '../elements/UnitBlock';


declare type StyleList = Array<[number, number, Style]>;

declare type RenderContext = {
    str: string,
    strIndex: number,
    unit: Inlineblock | undefined,
    maxWidth: number,
    line: ParagraphLine | undefined,
    sortedRanges: Array<[number, number]>,
    styleMap: Map<[number, number], Style>,
    exceed: boolean,
    renderFinish: boolean,
    styleIdMap: Map<Style, string>,
}

export interface TextContent {
    str: string
    styleList?: StyleList
}

function renderAttachment(content: string, unitBlock: Inlineblock) {
    unitBlock.innerHTML = '<i class="fa fa-file-archive-o fa-2x" aria-hidden="true"></i>';
    $$.setStyle(unitBlock, {
        cursor: 'pointer'
    })
}

function renderCodeOpen(content: string, unitBlock: Inlineblock) {
    unitBlock.innerHTML = '<i class="fa fa-codepen fa-2x" aria-hidden="true"></i>';
    $$.setStyle(unitBlock, {
        cursor: 'pointer'
    })
}

export function paragraphRendererFactor(editor: Editor) {
    return (parent: Node | undefined, node: Node) => {
        if (!parent) throw new Error();

        const { parentUi, nodeUi } = mountChild(editor, parent, node);

        const textContent = <TextContent>node.content;
        const viewLines = indentationWrap(editor, nodeUi, node.indentation);

        const paragraph: Paragraph = creEle(editor, 'paragraph');

        viewLines.appendChild(paragraph);

        if (!textContent || !textContent.str) {
            renderEmptyInParagraph(editor, paragraph);
        } else {
            appendLineToParagraph(editor, textContent, paragraph);
        }
    }
}

function renderEmptyInParagraph(editor: Editor, paragraph: Paragraph) {
    const line: ParagraphLine = creEle(editor, 'paragraph-line');

    line.setElementStart(0);

    paragraph.appendChild(line);

    const text: Text = creEle(editor, 'text');

    text.setElementStart(0);
    text.setEleUniId();

    line.appendChild(text);

    text.setStyle({
        'min-height': $$.getStrPx(Constants.WIDTH_BASE_CHAR, text).height + 'px',
        'min-width': '1px'
    });

    line.autoWidth();
}

export function appendLineToParagraph(editor: Editor, textContent: TextContent, paragraph: Paragraph) {
    let line: ParagraphLine | undefined = undefined;

    const paragraphInfo = paragraph.getInfo();
    let offset = 0;
    const sortedRanges = new Array<[number, number]>();
    const styleMap = new Map<[number, number], Style>();
    (textContent.styleList || []).forEach(item => {
        const range: [number, number] = [item[0], item[1]];
        sortedRanges.push(range);
        styleMap.set(range, item[2]);
    });

    const context: RenderContext = {
        str: textContent.str,
        strIndex: offset,
        unit: undefined,
        maxWidth: paragraphInfo.innerWidth,
        line: undefined,
        exceed: false,
        renderFinish: false,
        sortedRanges: sortedRanges,
        styleMap: styleMap,
        styleIdMap: new Map<Style, string>(),
    }

    while (offset < textContent.str.length) {
        line = creEle(editor, 'paragraph-line');

        line.setElementStart(offset);

        paragraph.appendChild(line);

        context.line = line;
        context.strIndex = offset;
        context.exceed = false;
        context.renderFinish = false;
        offset += renderElementsInLine(
            editor,
            context,
            [renderText, renderUnitBlock]
        );
    }
}

export function renderElementsInLine(
    editor: Editor,
    context: RenderContext,
    renders: Array<(editor: Editor, context: RenderContext) => void>): number {
    if (!context.line) throw new Error();
    const start = context.strIndex;

    context.line.fitContent();

    while (!context.renderFinish && !context.exceed) {
        renders.forEach(render => {
            startRender(editor, context, render);
        })
    }

    context.line.autoWidth();

    return context.strIndex - start;
}

function startRender(editor: Editor, context: RenderContext, render: (editor: Editor, context: RenderContext) => void) {
    if (context.renderFinish || context.exceed) return;

    if (context.strIndex >= context.str.length) {
        context.renderFinish = true;
        return;
    }

    render(editor, context);
}

function renderText(editor: Editor, context: RenderContext): void {
    if (!context.line) throw new Error();
    if (findUnitBlock(context.str, context.strIndex).unitBlock) {
        return;
    }
    const { foundRange, nearestNextRange } = $$.findInWhichRange(context.sortedRanges, context.strIndex);

    const style = foundRange ? context.styleMap.get(foundRange) : undefined;

    context.unit = creEle(editor, 'text');

    setEleUniIdAndStyle(style, context);

    context.unit.setElementStart(context.strIndex);

    context.line.appendChild(context.unit);

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
        const lineInfo = context.line.getInfo();

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


function renderUnitBlock(editor: Editor, context: RenderContext): void {
    if (!context.line) throw new Error();
    const { nextPosition, unitBlock, type, value } = findUnitBlock(context.str, context.strIndex);
    if (!unitBlock) return;

    context.unit = creEle(editor, 'unit-block');
    context.unit.setElementStart(context.strIndex);
    context.line.appendChild(context.unit);

    const { foundRange, nearestNextRange } = $$.findInWhichRange(context.sortedRanges, context.strIndex);
    const style = foundRange ? context.styleMap.get(foundRange) : undefined;

    setEleUniIdAndStyle(style, context);

    (<UnitBlock>context.unit).setUnitBlockType(type, value);
    switch (type) {
        case 'formula':
            katex.render(value, context.unit, { throwOnError: false });
            break;
        case 'attachment':
            renderAttachment(value, context.unit);
            break;
        case 'code':
            renderCodeOpen(value, context.unit);
            break;
    }

    const lineInfo = context.line.getInfo();
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


function setEleUniIdAndStyle(style: Style | undefined, context: RenderContext) {
    if (!context.unit) return;
    if (style) {
        const styleid = context.styleIdMap.get(style);
        if (!styleid) {
            context.styleIdMap.set(style, $$.randmonId());
        }
        context.unit.setEleUniId(styleid);
        context.unit.setStyle(style);
    } else {
        context.unit.setEleUniId();
    }
}