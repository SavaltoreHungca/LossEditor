import { Table } from './table/Table';
import { Component, ComponentType } from "../../compoentDefinitions";
import { DocTypes, Doc } from "../document/Doc";
import { ParagraphDoc } from "../document/paragraph/ParagraphDoc";
import { Paragraph } from "./paragraph/Paragraph";
import { TableDoc } from '../document/table/TableDoc';

export class DocCon extends Component {
    get type(): ComponentType {
        return ComponentType.DocCon;
    }

    constructor() {
        super(document.createElement('div'));
    }

    render(doc: Doc) {
        this.destroy();
        doc.blocks.forEach(ite => {
            switch (ite.type) {
                case DocTypes.pagraph: {
                    const paragraph = new Paragraph();
                    this.appendChild(paragraph);
                    paragraph.render(<ParagraphDoc>ite);
                    break;
                }
                case DocTypes.table: {
                    const table = new Table();
                    this.appendChild(table);
                    table.render(<TableDoc>ite);
                }
            }
        })
    }
}