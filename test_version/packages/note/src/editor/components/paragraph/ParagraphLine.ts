import { HtmlUtil } from './../../../utils/HtmlUtil';
import { Component, ComponentType, Text } from "../../../compoentDefinitions";
import { isNil, Nil } from "../../../utils";
import { TextUnit } from "../../document/paragraph/units/TextUnit";
import { UnitType, UnitDoc } from "../../document/paragraph/units/UnitDoc";

export class ParagraphLine extends Component {
    get type(): ComponentType {
        return ComponentType.ParagraphLine;
    }

    constructor() {
        super(document.createElement('div'));
        this.setStyle({
            width: '100%',
            'white-space': 'pre',
        })
    }


    public isBrLine = false;

    public setIsBrLine(isBrLine: boolean){
        this.isBrLine = isBrLine;
        return this;
    }

    putUnit(unit: UnitDoc): {
        remainDoc: UnitDoc
    } {
        switch (unit.type) {
            case UnitType.text: {
                const textUnit = <TextUnit>unit;

                let remain: TextUnit = Nil;

                const text = new Text()
                    .setInnerText(textUnit.text)
                    .setTextStyle(textUnit.style);

                let pivot = textUnit.text.length;

                this.appendChild(text);
                while (this.isExceed()) {
                    this.removeChild(text);
                    pivot--;
                    const [a, b] = textUnit.split(pivot);
                    remain = b;
                    if (pivot == 0) {
                        break;
                    }
                    this.appendChild(text.setInnerText(a.text));
                }

                if (!isNil(remain) && remain.text.length == 0) {
                    remain = Nil;
                }
                return {
                    remainDoc: remain
                }
            }
            case UnitType.br: {
                return {
                    remainDoc: unit
                }
            }
        }

        return {remainDoc: Nil}
    }

    private isExceed(): boolean {
        const parentInfo = this.parent.getInfo();
        console.log(this.contentLen)
        return this.contentLen > parentInfo.width;
    }

    get contentLen() {
        let ans = 0;
        this.children.forEach(ite => {
            ans += ite.getInfo().width;
        })
        return ans;
    }

}