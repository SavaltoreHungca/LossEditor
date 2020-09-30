
import { $$ } from "utils";
import { Constants } from "../../Constants";
import { Editor } from '../../Editor';
import { ContentContainer } from "../../elements/ContentContainer";
import { creEle } from "../../elements/elementTypes";

export function indentationWrap<T extends HTMLElement>(editor: Editor, container: T, padd?: number,): ContentContainer {
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