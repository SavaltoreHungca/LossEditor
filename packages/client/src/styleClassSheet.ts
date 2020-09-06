import { $$ } from 'utils'


export var classes = {
    hoverShow: $$.randmonId(),
    backChSelectd: $$.randmonId(),
    textUnderLine: $$.randmonId(),
    tabSelected: $$.randmonId(),
}

export function regisStyleSheet() {
    $$.addStyleSheet('.' + classes.hoverShow + ":hover", `
        opacity: 1;
    `)

    $$.addStyleSheet('.' + classes.hoverShow, `
        opacity: 0;
    `)

    $$.addStyleSheet('.' + classes.backChSelectd + ":hover", `
        background: rgba(55, 53, 47, 0.08);
    `)

    $$.addStyleSheet('.' + classes.backChSelectd, `
        transition: background 120ms ease-in 0s;
    `)

    $$.addStyleSheet('.' + classes.textUnderLine + ":hover", `
        text-decoration: underline;
    `)

    $$.addStyleSheet('.' + classes.tabSelected, `
        border-bottom: 1px solid black;
    `)
}