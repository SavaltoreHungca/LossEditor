import { DocNode } from "./elements/DocNode";
import { Editor } from ".";
import { Selection } from "editor-core";

export type SetCursorPositionResult = {
    left: number,
    top: number,
    height: number,
}

export interface CursorPositionBehavior {
    (element: DocNode, offset: number, editor: Editor): SetCursorPositionResult | undefined
}

export interface KeyDownBehavior {
    (event: KeyboardEvent, selection: Selection): void
}