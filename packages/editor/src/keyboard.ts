import { Editor } from "./Editor";
import { isHotkey, toKeyName } from 'is-hotkey';
import { getType } from "./utils";

export function listenUserPressKey(editor: Editor) {
    editor.container.addEventListener('keydown', (event: KeyboardEvent) => {
        const { selection } = editor;
        if (!selection) return;

        if (isHotkey('backspace', event)) {
            const { start, end, ancestor } = selection;
            if (!start || !end || !ancestor) throw new Error();

            if (!selection.isCollapsed) {
                switch (getType(ancestor)) {
                    case 'paragraph': {
                        const { left, right } = selection.leftAndRight;
                        const leftLine = <HTMLElement>left.node.parentElement;
                        const rightLine = <HTMLElement>right.node.parentElement;
                        const pargraph = <HTMLElement>leftLine.parentElement;

                        while (leftLine.nextElementSibling && leftLine.nextElementSibling !== rightLine) {
                            pargraph.removeChild(leftLine.nextElementSibling);
                        }

                        while (leftLine.lastElementChild && leftLine.lastElementChild !== left.node) {
                            leftLine.removeChild(leftLine.lastElementChild);
                        }
                        switch (getType(left.node)) {
                            case 'text': {
                                const innerText = left.node.innerText;
                                left.node.innerText = innerText.substring(0, left.offset);
                                if (!left.node.innerText) leftLine.removeChild(left.node);
                                break;
                            }
                            case 'unit-block': {
                                if (left.offset === 0) {
                                    leftLine.removeChild(left.node)
                                }
                                break;
                            }
                        }
                        if (!leftLine.firstElementChild) {
                            pargraph.removeChild(leftLine);
                        }


                        while (rightLine.firstElementChild && rightLine.firstElementChild !== right.node) {
                            rightLine.removeChild(rightLine.firstElementChild);
                        }
                        switch (getType(right.node)) {
                            case 'text': {
                                const innerText = right.node.innerText;
                                right.node.innerText = innerText.substring(right.offset, innerText.length);
                                if (!right.node.innerText) rightLine.removeChild(right.node);
                                break;
                            }
                            case 'unit-block': {
                                if (right.offset === 1) {
                                    rightLine.removeChild(right.node)
                                }
                                break;
                            }
                        }
                        if (!rightLine.firstElementChild) {
                            pargraph.removeChild(rightLine);
                        }
                    }
                }
            }
        }

    })
}