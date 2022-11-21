import { DocTypes } from "../Doc";
import { DocInterface } from "../DocInterface";

export class TableDoc extends DocInterface{
    get type(): DocTypes {
       return DocTypes.table;
    }
    constructor() {
        super();
    }

}