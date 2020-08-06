import { ContentContainer } from './../elements/elementTypes';
import { $$ } from "utils";
import { Constants } from "../Constants";
import { creEle } from '../elements/creEle';
import { Editor } from '../Editor';

export function indentationWrap(editor: Editor, container: HTMLElement, padd?: number,): ContentContainer {
    const indentation = creEle(editor, 'indentation');
    const contentContainer = creEle(editor, 'content-container');
    container.appendChild(indentation);
    indentation.appendChild(contentContainer);

    const viewLinesInfo = $$.getElementInfo(container);
    const paddingLeft = Constants.INDENTATION_WIDTH * (padd || 0);
    indentation.setStyle({
        'padding-left': paddingLeft,
    })
    contentContainer.setStyle({
        width: viewLinesInfo.innerWidth - paddingLeft
    })
    return contentContainer;
}