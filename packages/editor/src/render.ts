import { Utils } from "utils";
import { createElement } from './utils';
import { ScrollPage } from 'scroll-page';
import { Constants } from "./Constants";
import { renderParagraph } from "./render/renderParagraph";
import { renderTable } from "./render/renderTable";
import { renderImage } from "./render/renderImage";


export interface BlockType {
    type: string,
    indentation: number,
    content: any
}

function getContentType(content: any) {
    if (Utils.isObject(content)) {
        return content.type;
    }
    if (Utils.isArray(content)) {
        return 'doc';
    }
}

function indentationWrap(content: BlockType, viewLines: HTMLElement): HTMLElement {
    const indentation = createElement('indentation');
    const contentContainer = createElement('content-container');
    viewLines.appendChild(indentation);
    indentation.appendChild(contentContainer);

    const viewLinesInfo = Utils.getElementInfo(viewLines);
    const paddingLeft = Constants.INDENTATION_WIDTH * (content.indentation || 0);
    Utils.setStyle(indentation, {
        'padding-left': paddingLeft,
    })
    Utils.setStyle(contentContainer, {
        width: viewLinesInfo.innerWidth - paddingLeft
    })
    return contentContainer;
}

export function render(docStructure: any, viewLines: HTMLElement) {
    viewLines.innerHTML = '';
    const renderSwitch = (content: any) => {
        switch (getContentType(content)) {
            case "paragraph":
                renderParagraph(content, indentationWrap(content, viewLines));
                break;
            case "table":
                renderTable(content, indentationWrap(content, viewLines));
                break;
            case "image":
                renderImage(content, indentationWrap(content, viewLines));
                break;
        }
    }
    if (getContentType(docStructure) === 'doc') {
        for (let i = 0; i < docStructure.length; i++) {
            const content = docStructure[i];
            renderSwitch(content);
        }
    } else {
        renderSwitch(docStructure);
    }
}