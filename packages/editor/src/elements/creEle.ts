import { BackLayer, ViewLines, Cursor, RegionContainer, Container, UiNodeTypesMap } from './elementTypes';
import { UiNodeTypes } from "./elementTypes";
import { $$, extend } from "utils";
import { uiExt } from './ext/uiExt';
import { Editor } from '../Editor';
import { cursorExt } from './ext/cursorExt';
import { paraCntxtExt } from './ext/paraCntxtExt';
import { lineExt } from './ext/lineExt';
import { inlineBlockExt } from './ext/inlineBlockExt';
import { uniBlockExt } from './ext/uniBlockExt';

export function creEle<K extends keyof UiNodeTypesMap>(editor: Editor, type: K, ele?: HTMLElement): UiNodeTypesMap[K] {
    let element: HTMLElement;
    let style: Object;
    switch (type) {
        case 'container':
            if (!ele) throw new Error();
            return extend(ele, [uiExt(editor, 'container')]);
        case 'cursor':
            if (!ele) throw new Error();
            return extend($$.wrapEle('absolute', ele), [uiExt(editor, 'cursor'), cursorExt(editor)]);
        case 'back-layer':
            if (ele) element = $$.wrapEle('absolute', ele); else element = $$.creEle('absolute');
            return extend(element, [uiExt(editor, 'back-layer')]);
        case 'view-lines':
            style = {
                outline: 'none',
                'user-select': 'none',
            }
            if (ele) element = $$.wrapEle('absolute', ele, style); else element = $$.creEle('absolute', style);
            element.setAttribute('tabindex', '1');
            return extend(element, [uiExt(editor, 'view-lines')]);
        case 'region-container':
            if (ele) element = $$.wrapEle('absolute', ele); else element = $$.creEle('absolute');
            return extend(element, [uiExt(editor, 'region-container')]);
        case 'paragraph':
            return extend($$.creEle('block'),
                [uiExt(editor, 'paragraph'), paraCntxtExt(editor)]);
        case 'paragraph-line':
            return extend($$.creEle('block'),
                [uiExt(editor, 'paragraph-line'), paraCntxtExt(editor), lineExt(editor)]);
        case 'text':
            return extend($$.creEle('inline'),
                [uiExt(editor, 'text'), paraCntxtExt(editor), inlineBlockExt(editor)]);
        case 'unit-block':
            return extend($$.creEle('inline'),
                [uiExt(editor, 'unit-block'), paraCntxtExt(editor), inlineBlockExt(editor), uniBlockExt(editor)]);
        case 'indentation':
            return extend($$.creEle('block'),
                [uiExt(editor, 'indentation')]);
        case 'content-container':
            return extend($$.creEle('block'),
                [uiExt(editor, 'content-container')]);
    }

    throw new Error();
}