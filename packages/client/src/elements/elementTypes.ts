import { Container, containerExt } from './Container';
import { $$, ElementInfo, extend, Nil } from 'utils';
import { MemLoss } from '../MemLoss';
import { elementExt } from './Element';
import { LeftSidePad, leftSidePadExt } from './LeftSidePad';
import { RightSidePad, rightSidePadExt } from './RightSidePad';
import { FunctionMenu, functionMenuExt } from './FunctionMenu';
import { NodeListPad, nodeListPadExt } from './NodeListPad';
import { ResizeBar, resizeBarExt } from './ResizeBar';
import { NodeItem, nodeItemExt } from './NodeItem';
import { NotePad, notePadExt } from './NotePad';
import { IntroductionPad, introductionPadExt } from './IntroductionPad';

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
            ans =  extend(element, [elementExt(memloss, type), introductionPadExt(memloss)]);
            break;
    }
    return ans;
}