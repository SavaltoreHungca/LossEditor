import { Editor } from './Editor';
import { $$ } from 'utils'


export var classes = {
    flashcursor: $$.randmonId(),
}

export function regisStyleSheet(editor: Editor) {
    $$.addStyleSheet(`@keyframes ${classes.flashcursor}`, `
        from {
            opacity: 1.0;
        }
        50% {
            opacity: 0;
        }
        to {
            opacity: 1.0;
        }
    `)
}

