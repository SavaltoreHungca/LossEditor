import { MapObj, extend } from "utils";
import { Node } from "editor-core";
import { nodeParaExt } from "../docs/DocParagraph";

export function nodeCreator<T extends Node>(obj: MapObj): T | Node {
    const node = new Node();

    for (const name in obj) {
        node[name] = obj[name];
    }

    switch (node.type) {
        case 'root': 
            return node;
        case 'paragraph':
            return extend(node, [nodeParaExt]);
        case 'sentinel':
            return node;
    }

    throw new Error(`未定义node ${node.type}的创建方式`);
}