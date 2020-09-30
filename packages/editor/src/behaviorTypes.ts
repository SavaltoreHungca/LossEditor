import { DocNode } from "./elements/docs/DocNode";
import { Editor } from ".";
import { Selection, Node } from "editor-core";


export type SetCursorPositionResult = {
    left: number,
    top: number,
    height: number,
}

export type SetSelectionResult = {
    pointType: 'start' | 'end'
    offset: number
}

export interface BehaviorTypes {
    SetSelectionBehavior: SetSelectionBehavior
    CursorPositionBehavior: CursorPositionBehavior
    KeyDownBehavior: KeyDownBehavior
}

export interface SetSelectionBehavior {
    (node: Node): SetSelectionResult | undefined
}

export interface CursorPositionBehavior {
    (element: DocNode, offset: number, editor: Editor): SetCursorPositionResult | undefined
}

export interface KeyDownBehavior {
    (event: KeyboardEvent, selection: Selection): void
}