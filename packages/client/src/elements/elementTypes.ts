import { Container, containerExt } from './Container';
import { $$, ElementInfo, extend } from 'utils';
import { MemLoss } from '../MemLoss';
import { elementExt } from './Element';
import { LeftSidePad, leftSidePadExt } from './LeftSidePad';
import { RightSidePad, rightSidePadExt } from './RightSidePad';
import { FunctionMenu, functionMenuExt } from './FunctionMenu';
import { NodeListPad, nodeListPadExt } from './NodeListPad';
import { ResizeBar, resizeBarExt } from './ResizeBar';
import { NodeItem, nodeItemExt } from './NodeItem';

export type ElementTypsMap = {
    container: Container
    leftSidePad: LeftSidePad
    rightSidePad: RightSidePad
    functionMenu: FunctionMenu
    nodeListPad: NodeListPad
    resizeBar: ResizeBar
    nodeItem: NodeItem
}

export function creEle<K extends keyof ElementTypsMap>(memloss: MemLoss, type: K, ele?: HTMLElement): ElementTypsMap[K] {
    let element = ele;
    switch (type) {
        case 'container':
            return extend(element, [elementExt(memloss, type), containerExt(memloss)]);

        case 'leftSidePad':
            return extend(element, [elementExt(memloss, type), leftSidePadExt(memloss)]);

        case 'rightSidePad':
            return extend(element, [elementExt(memloss, type), rightSidePadExt(memloss)]);

        case 'functionMenu':
            return extend(element, [elementExt(memloss, type), functionMenuExt(memloss)]);

        case 'nodeListPad':
            return extend(element, [elementExt(memloss, type), nodeListPadExt(memloss)]);

        case 'resizeBar':
            return extend(element, [elementExt(memloss, type), resizeBarExt(memloss)]);

        case 'nodeItem':
            if(!ele) element = $$.creEle('block');
            return extend(element, [elementExt(memloss, type), nodeItemExt(memloss)]);
    }
    throw new Error();
}