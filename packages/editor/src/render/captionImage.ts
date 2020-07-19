import { createElement } from "../utils";
import { Utils, $ } from "utils";
import { ScrollPage } from "scroll-page";
import { Editor } from "../Editor";
import { Node } from "editor-core";
import { indentationWrap } from "./indentationWrap";


interface CaptionImageContent {
    caption: string
    imageUrl: string
}

export function captionImageRendererFactory(editor: Editor){
    return (parent: Node | undefined, node: Node)=>{
        if (!parent) throw new Error(`无法找到承载的父容器`);
        const parentUi = <HTMLElement>editor.uiMap.getvalue(parent);
        const nodeUi = <HTMLElement>editor.uiMap.getvalue(node);

        if (nodeUi.parentElement !== parentUi) {
            nodeUi.parentElement?.removeChild(nodeUi);
            parentUi.appendChild(nodeUi);
        }

        renderImage(node.content, indentationWrap(node, nodeUi));
    }
}

export function renderImage(content: CaptionImageContent, viewLines: HTMLElement) {
    const image = createElement('image');
    viewLines.appendChild(image);

    const idset = {
        caption: Utils.randmonId(),
        imgContainer: Utils.randmonId(),
        img: Utils.randmonId()
    }
    Utils.setStyle(image, {'white-space': 'normal', 'border': '1px black solid'});
    image.innerHTML = `
        <div id=${idset.imgContainer} style="width: 100px; height: 100px">
            <img id=${idset.img} src=${content.imageUrl} style="display: block; position: relative; width: 1000px; height: 1000px">
        </div>
        <div id=${idset.caption} style="width: 100px; height: 18px; text-align: center">
            <span style="display: inline-block">${content.caption}</span>
        </div>
    `
    new ScrollPage($(idset.img), {
        bottomScrollBarHeight: 1,
        rightScrollBarWidth: 1,
        bottomScrollBarInner: false,
        rightScrollBarInner: false,
        showTopShallow: false,
        showRightShallow: false
    })
}