import { Editor } from './Editor';
import { Constants } from './Constants';
import { getType } from './utils';
import { Utils } from 'utils';
import { appendLineToParagraph } from './render/renderParagraph';
import { setSelectionOnParagraphLast } from './Selection';

export function listenTextInput(editor: Editor) {
    editor.eventManager.registryEvent(Constants.events.TEXT_INPUT, () => {
        const { selection } = editor;
        if (!selection) return;

        if (selection.isCollapsed) {
            const { ancestor, start, end } = selection;
            if (!ancestor || !start || !end) throw new Error();

            if (getType(ancestor) === 'text') {
                if(selection.isOnPlaceHolder){
                    const paragraph = <HTMLElement>ancestor.parentElement?.parentElement;
                    paragraph.innerHTML = '';
                    appendLineToParagraph({
                        type: 'paragraph',
                        indentation: 0,
                        content: editor.inputText
                    }, paragraph);
                    setSelectionOnParagraphLast(paragraph, editor)
                    editor.eventManager.triggleEvent(Constants.events.SELECTION_CHANGE);
                }else {
                    const curLine = <HTMLElement>ancestor.parentElement;
                    const paragraph = <HTMLElement>curLine.parentElement;
                    end.node.innerText = Utils.insertStrBefore(end.node.innerText, end.offset, editor.inputText);
                    end.offset += editor.inputText.length;
                    start.offset += editor.inputText.length;
                    editor.eventManager.triggleEvent(Constants.events.SELECTION_CHANGE);
                }
            }

        }
    })
}