import { Component, ComponentType } from "../../../compoentDefinitions";

export class ParagraphUnit extends Component {
    get type(): ComponentType {
        return ComponentType.ParagraphUnit;
    }
    
    constructor() {
        super(document.createElement('div'));
    }
}