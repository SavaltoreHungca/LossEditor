import { createElement } from "../utils";
import { Utils, $ } from "utils";
import { ScrollPage } from "scroll-page";
import { Editor } from "../Editor";
import { Node } from "editor-core";
import { indentationWrap } from "./indentationWrap";
import { mountChild } from "./resolveNodeRelation";


interface CaptionImageContent {
    caption: string
    imageUrl: string
}

export function captionImageRendererFactory(editor: Editor){
    return (parent: Node | undefined, node: Node)=>{
        const {parentUi, nodeUi} = mountChild(editor, parent, node);
    }
}