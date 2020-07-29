import { ScrollPage } from './ScrollPage';
import { $$ } from 'utils'


export var classes = {
    sliderhover: $$.randmonId(),
}

export function regisStyleSheet(sp: ScrollPage) {
    $$.addStyleSheet('.' + classes.sliderhover + ":hover", `
        background: hsla(0,0%,39%,.7);
    `)

    $$.addStyleSheet('.' + classes.sliderhover , `
        background: hsla(0,0%,39%,.4);
    `)
}

