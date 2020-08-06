import { $$, $ } from 'utils';
import { Editor } from "../Editor";
import { mountChild } from "./resolveNodeRelation";
import { Node } from 'editor-core';
import { ScrollPage } from 'scroll-page';

export type ImageContent = {
    url: string
}

export function imageRendererFactory(editor: Editor) {
    return (parent: Node | undefined, node: Node) => {
        if(!parent) throw new Error();

        const { parentUi, nodeUi } = mountChild(editor, parent, node);
        const content = <ImageContent>node.content;
        const idset = {
            caption: $$.randmonId(),
            imgContainer: $$.randmonId(),
            img: $$.randmonId()
        }

        $$.setStyle(nodeUi, { 'white-space': 'normal', 'border': '1px black solid' });
        nodeUi.innerHTML = `
            <div id=${idset.imgContainer} style="width: 100px; height: 100px">
                <img id=${idset.img} src=${content.url} style="display: block; position: relative; width: 1000px; height: 1000px">
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
}