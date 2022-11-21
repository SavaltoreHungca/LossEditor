import { Component, ComponentType, Text } from "../../../compoentDefinitions";
import { isNil, Nil } from "../../../utils";
import { HtmlUtil } from "../../../utils/HtmlUtil";
import { ParagraphDoc } from "../../document/paragraph/ParagraphDoc";
import { TextUnit } from "../../document/paragraph/units/TextUnit";
import { UnitType } from "../../document/paragraph/units/UnitDoc";
import { ParagraphLine } from "./ParagraphLine";

export class Paragraph extends Component {
    get type(): ComponentType {
        return ComponentType.Paragraph;
    }


    constructor() {
        super(document.createElement('div'));
    }

    public render(doc: ParagraphDoc) {
        let currentLine: ParagraphLine = Nil
        if (doc.units.length > 0) {
            currentLine = new ParagraphLine();
            this.appendChild(currentLine);
        }
        doc.units.forEach(unit => {
            const rlt = currentLine.putUnit(unit);
            if (!isNil(rlt.remainDoc)) {
                currentLine = new ParagraphLine();
                if(rlt.remainDoc.type === UnitType.br){
                    currentLine.setIsBrLine(true);
                }
                this.appendChild(currentLine);
                currentLine.putUnit(rlt.remainDoc)
            }
        })
    }
}