import { Node } from './Node'

export type Point = {
    node: Node
    offset: number
}

export interface Selection {
    start?: Point
    end?: Point
}