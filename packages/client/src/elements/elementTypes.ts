import { RssListPad, rssListPadExt } from './leftpad/RssListPad';
import { LeftDirectoryTree, leftDirectoryTreeExt } from './leftpad/LeftDirectoryTree';
import { Container, containerExt } from './Container';
import { $$, ElementInfo, extend, Nil } from 'utils';
import { MemLoss } from '../MemLoss';
import { elementExt } from './Element';
import { LeftSidePad, leftSidePadExt } from './leftpad/LeftSidePad';
import { RightSidePad, rightSidePadExt } from './rightpad/RightSidePad';
import { FunctionMenu, functionMenuExt } from './leftpad/FunctionMenu';
import { NodeListPad, nodeListPadExt } from './leftpad/NodeListPad';
import { ResizeBar, resizeBarExt } from './ResizeBar';
import { NodeItem, nodeItemExt } from './leftpad/NodeItem';
import { NotePad, notePadExt } from './rightpad/NotePad';
import { IntroductionPad, introductionPadExt } from './rightpad/IntroductionPad';
import { NoteTab, noteTabExt } from './rightpad/NoteTab';
import { GlobalSearch, globalSearchExt } from './GlobalSearch';

export interface Pad {
    render(): void
    disappear(): void
}

export type ElementTypsMap = {
    container: Container
    leftSidePad: LeftSidePad
    rightSidePad: RightSidePad
    functionMenu: FunctionMenu
    nodeListPad: NodeListPad
    resizeBar: ResizeBar
    nodeItem: NodeItem
    notePad: NotePad
    introductionPad: IntroductionPad
    leftDirectoryTree: LeftDirectoryTree
    rssListPad: RssListPad
    noteTab: NoteTab
    globalSearch: GlobalSearch
}

export function creEle<K extends keyof ElementTypsMap>(memloss: MemLoss, type: K, ele?: HTMLElement): ElementTypsMap[K] {
    let element = ele;
    let ans: ElementTypsMap[K] = Nil;
    switch (type) {
        case 'container':
            ans = extend(element, [elementExt(memloss, type), containerExt(memloss)]);
            break;

        case 'leftSidePad':
            ans = extend(element, [elementExt(memloss, type), leftSidePadExt(memloss)]);
            break;

        case 'rightSidePad':
            ans = extend(element, [elementExt(memloss, type), rightSidePadExt(memloss)]);
            break;

        case 'functionMenu':
            ans = extend(element, [elementExt(memloss, type), functionMenuExt(memloss)]);
            break;

        case 'nodeListPad':
            if (!ele) element = $$.creEle('block');
            ans = extend(element, [elementExt(memloss, type), nodeListPadExt(memloss)]);
            break;

        case 'resizeBar':
            ans = extend(element, [elementExt(memloss, type), resizeBarExt(memloss)]);
            break;

        case 'nodeItem':
            if (!ele) element = $$.creEle('block');
            ans = extend(element, [elementExt(memloss, type), nodeItemExt(memloss)]);
            break;

        case 'notePad':
            if (!ele) element = $$.creEle('block');
            ans = extend(element, [elementExt(memloss, type), notePadExt(memloss)]);
            break;

        case 'introductionPad':
            if (!ele) element = $$.creEle('block');
            ans = extend(element, [elementExt(memloss, type), introductionPadExt(memloss)]);
            break;

        case 'leftDirectoryTree':
            ans = extend(element, [elementExt(memloss, type), leftDirectoryTreeExt(memloss)]);
            break;

        case 'rssListPad':
            if (!ele) element = $$.creEle('block');
            ans = extend(element, [elementExt(memloss, type), rssListPadExt(memloss)]);
            break;

        case 'noteTab':
            if (!ele) element = $$.creEle('inline');
            ans = extend(element, [elementExt(memloss, type), noteTabExt(memloss)]);
            break;

        case 'globalSearch':
            if (!ele) element = $$.creEle('block');
            ans = extend(element, [elementExt(memloss, type), globalSearchExt(memloss)]);
            break;
    }
    return ans;
}