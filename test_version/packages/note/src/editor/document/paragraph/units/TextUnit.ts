import { TextStyle } from "../../../../compoentDefinitions";
import { Nil } from "../../../../utils";
import { UnitType, UnitDoc } from "./UnitDoc";


export class TextUnit extends UnitDoc {
    get type(): UnitType {
        return UnitType.text
    }

    public text: string = Nil
    public style: TextStyle = Nil;

    public setText(text: string){
        this.text = text;
        return this;
    }

    public setStyle(style: TextStyle){
        this.style = style;
        return this;
    }

    public split(pivot: number){
        const a = new TextUnit()
                    .setText(this.text.substring(0, pivot))
                    .setStyle(this.style);

        const b = new TextUnit()
                    .setText(this.text.substring(pivot))
                    .setStyle(this.style)

        return [a, b];
    }
}