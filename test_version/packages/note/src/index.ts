import { ScrollWin } from './scrollpage/components/ScrollWin';
import { Div, Win, Text } from "./compoentDefinitions";
import { randmonId } from "./utils";
import { HtmlUtil } from "./utils/HtmlUtil";
import { EditablePage } from './editor/components/EditablePage';
import { getTestDocument } from './editor/document/Doc';

export var styleClasses = {
    noScrollBar: randmonId(),
    flushcursor: randmonId(),
}

/** 渲染页面的起点 */
export function init() {
    initStyleSheet();

    const editor = new EditablePage(277, 100);
    Win.document.body.appendChild(editor);
    editor.renderDocument(getTestDocument());
    // Win.document.body.appendChild(new ScrollWin(new Div()
    //     .setStyle({
    //         // position: "fixed",
    //         left: 0,
    //         top: 0,
    //         width: "100vw",
    //         height: "100vh"
    //     }), 100, 100));
}

function initStyleSheet() {
    HtmlUtil.addStyleSheet(`.${styleClasses.noScrollBar}::-webkit-scrollbar`, {
        width: '0px',
        height: '0px'
    })

    // HtmlUtil.addStyleSheet(`.${styleClasses.noScrollBar}`, {
    //     '-ms-overflow-style': 'none',
    //     'overflow': '-moz-scrollbars-none'
    // })

    HtmlUtil.addStyleSheet(`@keyframes ${styleClasses.flushcursor}`, `
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