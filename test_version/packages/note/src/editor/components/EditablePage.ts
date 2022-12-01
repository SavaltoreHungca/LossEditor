import { Component, ComponentType } from "../../compoentDefinitions";
import { forInObject, Nil } from "../../utils";
import { Cursor } from "./Cursor";
import { Doc } from "../document/Doc";
import { DocCon } from "./DocCon";

/** 可编辑页面 */
export class EditablePage extends Component {

    private cursor: Cursor = new Cursor();

    get type(): ComponentType {
        return ComponentType.EditablePage;
    }

    constructor(width: number, height: number) {
        super(document.createElement('div'));
        this.setStyle({
            position: 'relative',
            width: width,
            height: height,
            background: 'grey'
        });
    }


    public renderDocument(doc: Doc) {
        this.destroy();
        this.appendChild(this.cursor);
        const docCon = new DocCon();
        this.appendChild(docCon);
        docCon.render(doc);
        return this;
    }
}