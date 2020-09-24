import { Editor } from '../../Editor';
import { getType } from "../../utils";
import { $$, ct, Nil } from "utils";
import { DocParagraph } from '../../elements/DocParagraph';
import { DocNode } from '../../elements/DocNode';

export function setCursorPositionForParagraph(docNode: DocNode, offset: number, editor: Editor) {
    const docParagraph: DocParagraph = ct(docNode);

    const ans = {
        left: 0,
        top: 0,
        height: 0
    };

    let line;
    let inLineElement;
    if(editor.whenClick && editor.whenClick.clickdInlineEle){
        inLineElement = editor.whenClick.clickdInlineEle;
        line = inLineElement.getLine();

        editor.whenClick = Nil;
    }
    else {
        line = docParagraph.getLineByOffset(offset);
        inLineElement = line.getInlineBlockByOffset(offset);
    }

    switch (getType(inLineElement)) {
        case 'text': {
            const posi = $$.getRelativePosition(inLineElement, editor.viewLines);
            const textOffset = $$.getStrPx(
                inLineElement.innerText.substring(0, offset - inLineElement.getElementStart()),
                inLineElement
            ).width;

            ans.left = posi.left + textOffset;
            ans.top = posi.top;
            ans.height = inLineElement.offsetHeight;
            break;
        }
        case 'unit-block': {
            const posi = $$.getRelativePosition(inLineElement, editor.viewLines);
            let blockOffset = -$$.getElementInfo(editor.cursor).width;
            if (offset > inLineElement.getElementStart()) {
                blockOffset = $$.getElementInfo(inLineElement).width;
            }

            ans.left = posi.left + blockOffset;
            ans.top = posi.top;
            ans.height = inLineElement.offsetHeight;
            break;
        }
        default: return undefined;
    }

    return ans;
}
