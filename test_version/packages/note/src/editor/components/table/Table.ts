
import { Component, ComponentType } from "../../../compoentDefinitions";
import { TableDoc } from "../../document/table/TableDoc";

export class Table extends Component {
    get type(): ComponentType {
        return ComponentType.Table;
    }
    
    constructor() {
        super(document.createElement('div'));
    }

    public render(doc: TableDoc) {

    }
}