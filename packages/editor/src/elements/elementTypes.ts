import { BackLayer } from './BackLayer';
import { ViewLines, viewLinesExt } from './ViewLines';
import { Cursor, cursorExt } from './Cursor';
import { RegionContainer } from './RegionContainer';
import { Container, containerExt } from './Container';
import { $$, extend } from "utils";
import { Indentation } from './Indentation';
import { Image } from './Image';
import { Table } from './Table';
import { Row } from './Row';
import { Cell } from './Cell';
import { Paragraph } from './Paragraph';
import { ParagraphLine, lineExt } from './ParagraphLine';
import { UnitBlock, uniBlockExt } from './UnitBlock';
import { ContentContainer } from './ContentContainer';
import { Editor } from '../Editor';
import { uiExt } from './UiElement';
import { paraCntxtExt } from './ParagraphContext';
import { inlineBlockExt } from './Inlineblock';
import { Text } from './Text';

export type UiNodeTypesMap = {
    'region-container': RegionContainer
    'cursor': Cursor
    'container': Container
    'indentation': Indentation
    'image': Image
    'table': Table
    'row': Row
    'cell': Cell
    'view-lines': ViewLines
    'back-layer': BackLayer
    'paragraph': Paragraph
    'paragraph-line': ParagraphLine
    'text': Text
    'unit-block': UnitBlock
    'content-container': ContentContainer
}
export type UiNodeTypes = keyof UiNodeTypesMap;

export type Style = {
    [index: string]: string | number
}

export function creEle<K extends keyof UiNodeTypesMap>(editor: Editor, type: K, ele?: HTMLElement): UiNodeTypesMap[K] {
    let element: HTMLElement;
    switch (type) {
        case 'container':
            if (!ele) throw new Error();
            return extend(ele, [uiExt(editor, type), containerExt(editor)]);
        case 'cursor':
            if (!ele) throw new Error();
            return extend($$.wrapEle('absolute', ele), [uiExt(editor, type), cursorExt(editor)]);
        case 'back-layer':
            if (ele) element = $$.wrapEle('absolute', ele); else element = $$.creEle('absolute');
            return extend(element, [uiExt(editor, type)]);
        case 'view-lines':
            if (ele) element = $$.wrapEle('block', ele); else element = $$.creEle('block');
            return extend(element, [uiExt(editor, type), viewLinesExt(editor)]);
        case 'region-container':
            if (ele) element = $$.wrapEle('absolute', ele); else element = $$.creEle('absolute');
            return extend(element, [uiExt(editor, type)]);
        case 'paragraph':
            return extend($$.creEle('block'),
                [uiExt(editor, type), paraCntxtExt(editor)]);
        case 'paragraph-line':
            return extend($$.creEle('block'),
                [uiExt(editor, type), paraCntxtExt(editor), lineExt(editor)]);
        case 'text':
            return extend($$.creEle('inline'),
                [uiExt(editor, type), paraCntxtExt(editor), inlineBlockExt(editor)]);
        case 'unit-block':
            return extend($$.creEle('inline'),
                [uiExt(editor, type), paraCntxtExt(editor), inlineBlockExt(editor), uniBlockExt(editor)]);
        case 'indentation':
            return extend($$.creEle('block'),
                [uiExt(editor, type)]);
        case 'content-container':
            return extend($$.creEle('block'),
                [uiExt(editor, type)]);
    }

    throw new Error();
}
