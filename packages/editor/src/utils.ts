import { UiNodeTypes } from "./elements/elementTypes"

export function getType(node: HTMLElement): UiNodeTypes | undefined {
    const type = node.getAttribute('data-editor-type')
    if (type) {
        return <any>type
    } else {
        return undefined
    }
}

export function getNodeFromChild(node: HTMLElement): HTMLElement | undefined {
    let cur = node
    while (true) {
        const type = getType(cur)
        if (type) {
            return cur
        }
        if (cur.parentElement) {
            cur = cur.parentElement
        } else {
            return undefined
        }
    }
}

export function getDocNodeFromChild(node: HTMLElement) {
    let cur = node
    while (true) {
        const type = cur.getAttribute('data-node-type')
        if (type) {
            return cur
        }
        if (cur.parentElement) {
            cur = cur.parentElement
        } else {
            return undefined
        }
    }
}
