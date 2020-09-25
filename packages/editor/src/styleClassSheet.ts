import { Editor } from './Editor';
import { $$ } from 'utils'


export var classes = {
    flashcursor: $$.randmonId(),
    hoverShow: $$.randmonId(),
}

export function regisStyleSheet(editor: Editor) {
    $$.addStyleSheet('.' + classes.hoverShow + ":hover", `
        opacity: 1;
    `)

    $$.addStyleSheet('.' + classes.hoverShow, `
        opacity: 0;
    `)

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

