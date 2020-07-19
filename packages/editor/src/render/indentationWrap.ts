import { Node } from "editor-core";
import { createElement } from "../utils";
import { Utils } from "utils";
import { Constants } from "../Constants";

export function indentationWrap(node: Node, viewLines: HTMLElement): HTMLElement {
    const indentation = createElement('indentation');
    const contentContainer = createElement('content-container');
    viewLines.appendChild(indentation);
    indentation.appendChild(contentContainer);

    const viewLinesInfo = Utils.getElementInfo(viewLines);
    const paddingLeft = Constants.INDENTATION_WIDTH * (node.indentation || 0);
    Utils.setStyle(indentation, {
        'padding-left': paddingLeft,
    })
    Utils.setStyle(contentContainer, {
        width: viewLinesInfo.innerWidth - paddingLeft
    })
    return contentContainer;
}