import { Nil } from "../../utils";
import { DocInterface } from "./DocInterface";
import { ParagraphDoc } from "./paragraph/ParagraphDoc";
import { BrUnit } from "./paragraph/units/BrUnit";
import { TextUnit } from "./paragraph/units/TextUnit";
import { TableDoc } from "./table/TableDoc";

export enum DocTypes {
    doc, pagraph, table
} 


export class Doc extends DocInterface {
    get type(): DocTypes {
        return DocTypes.doc;
    }

    blocks: Array<ParagraphDoc | TableDoc> = [];

    constructor() {
        super()
    }


}


export function getTestDocument(): Doc {
    const doc = new Doc();
    const paragraph = new ParagraphDoc();
    doc.blocks.push(paragraph)

    for (let i = 0; i < 100; i++) {
        const text = new TextUnit();

        text.text = "我你他 ";
        text.style = {
            color: 'blue',
            size: 12
        }

        if(i == 17){
            paragraph.units.push(new BrUnit())
        }

        paragraph.units.push(text);
    }

    return doc;
}