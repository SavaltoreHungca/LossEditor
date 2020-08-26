export interface Node {
    id: string
    tag: string
    title: string
    children?: Array<Node>
}

export type NodeCategory = Array<Node>;