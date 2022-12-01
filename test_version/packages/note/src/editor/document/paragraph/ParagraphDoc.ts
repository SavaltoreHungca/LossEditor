import { Nil } from "../../../utils";
import { DocTypes } from "../Doc";
import { DocInterface } from "../DocInterface";
import { UnitDoc } from "./units/UnitDoc";


export class ParagraphDoc extends DocInterface {
    get type(): DocTypes {
        return DocTypes.pagraph;
    }

    units: Array<UnitDoc> = [];



}