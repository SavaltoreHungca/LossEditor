import { ct } from 'utils';
import { UiNodeTypes } from "./elements/elementTypes"
import { UiElement } from './elements/UiElement';
import { DocNode } from './elements/docs/DocNode';

export function getType(node: HTMLElement): UiNodeTypes | undefined {
    const type = node.getAttribute('data-editor-type')
    if (type) {
        return ct(type);
    } else {
        return undefined
    }
}

export function getNodeFromChild(node: HTMLElement): UiElement | undefined {
    let cur = node
    while (true) {
        const type = getType(cur)
        if (type) {
            return ct(cur);
        }
        if (cur.parentElement) {
            cur = cur.parentElement
        } else {
            return undefined
        }
    }
}

export function getDocNodeFromChild(node: HTMLElement): DocNode | undefined {
    let cur = node
    while (true) {
        const type = cur.getAttribute('data-editor-doc-type')
        if (type) {
            return ct(cur);
        }
        if (cur.parentElement) {
            cur = cur.parentElement
        } else {
            return undefined
        }
    }
}
