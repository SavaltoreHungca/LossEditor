import { Node } from './Node';
import { Point, Selection } from './Selection';

export type SetSelectionResult = {
    pointType: 'start' | 'end'
    offset: number
}

export interface SetSelectionBehavior {
    (node: Node, data: any): SetSelectionResult | undefined
}

export interface Renderer {
    (parent: Node | undefined, node: Node): void
}

export interface TextInputBehavior {
    (point: Point, text: string): void
}

export type EventTypes = {
    node_created: (parent: Node | undefined, child: Node) => void
    selection_change: (selection: Selection) => void
}

export interface BackSpaceBehavior {
    (selection: Selection): void
}

export interface TypeSettingBehavior {
    (point: Point): void
}

export interface EmptyOrgnizerNodeRnderBehavior {
    (node: Node): void
}