import { styleClasses } from "../..";
import { Component, ComponentType } from "../../compoentDefinitions";

export class Cursor extends Component {
    get type(): ComponentType {
        throw new Error("Method not implemented.");
    }


    constructor() {
        super(document.createElement('div'));
        this.setStyle({
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
            "top": "0",
            "left": "0",
            "width": "1px",
            "height": "18px",
            "z-index": "1",
            "user-select": "none",
            'white-space': 'pre',
            animation: `${styleClasses.flushcursor} 600ms infinite;`
            // "visibility": "hidden"
        })
    }
}