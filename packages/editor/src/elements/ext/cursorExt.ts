import { Editor } from '../../Editor';
import { $$ } from 'utils';
import { classes } from '../../styleClassSheet';
export function cursorExt(editor: Editor) {

    return (cursor: HTMLElement) => {
        $$.setStyle(cursor, {
            "margin": "0",
            "padding": "0",
            "position": "absolute",
            "outline": "none!important",
            "resize": "none",
            "border": "none",
            "border-left": "0.5px black solid",
            "overflow": "hidden",
            "color": "transparent",
            "background-color": "black",
            "font-family": 'Menlo, Monaco, "Courier New", monospace',
            "font-weight": "normal",
            "font-size": "12px",
            "font-feature-settings": '"liga" 0, "calt" 0',
            "line-height": "18px",
            "letter-spacing": "0px",
            "top": "209px",
            "left": "91px",
            "width": "1px",
            "height": "18px",
            "z-index": "1",
            "user-select": "none",
            'white-space': 'pre',
            animation: `${classes.flashcursor} 600ms infinite;`
            // "visibility": "hidden"
        })

        return {
            setPosition: function (left: number, top: number, height?: number) {
                const style: any = {
                    left: left,
                    top: top,
                    visibility: 'visible'
                };
                if(typeof height !== 'undefined'){
                    style.height = height;
                }
                $$.setStyle(cursor, style);
            }
        }
    }
}