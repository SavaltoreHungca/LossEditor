import { Editor } from './Editor';
import { Constants } from './Constants';
import { getType } from './utils';
import { Utils } from 'utils';

export function listenTextInput(editor: Editor) {
    editor.eventManager.registryEvent(Constants.events.TEXT_INPUT, () => {
        const { selection } = editor;
        if (!selection) return;

        if (selection.isCollapsed) {
            const { ancestor, start, end } = selection;
            if (!ancestor || !start || !end) throw new Error();

            if (getType(ancestor) === 'text') {
                const curLine = <HTMLElement>ancestor.parentElement;
                const paragraph = <HTMLElement>curLine.parentElement;
                end.node.innerText = Utils.insertStrBefore(end.node.innerText, end.offset, editor.inputText);
                end.offset += editor.inputText.length;
                start.offset += editor.inputText.length;
                editor.eventManager.triggleEvent(Constants.events.SELECTION_CHANGE);
            }

        }

        console.log(editor.inputText);
    })
}