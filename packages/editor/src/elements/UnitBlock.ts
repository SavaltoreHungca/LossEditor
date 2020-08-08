import { Editor } from "../Editor"
import { Inlineblock } from "./Inlineblock"
import { Constants } from "../Constants"

export interface UnitBlock extends Inlineblock {
    setUnitBlockType(type: string, value: string): void
    getUnitblockOffset(): number
    getUnitBlockType(): { type: string, value: string }
}

export function uniBlockExt(editor: Editor) {
    return (ele: HTMLElement)=>{
        return {
            setUnitBlockType: function (type: string, value: string) {
                ele.setAttribute(Constants.props.DATA_UNIT_BLOCK_TYPE, type)
                ele.setAttribute(Constants.props.DATA_UNIT_BLOCK_VALUE, value)
            },
            getUnitblockOffset: function () {
                const { type, value } = this.getUnitBlockType()
                return type.length + value.length + 6
            },
            getUnitBlockType: function () {
                return {
                    type: <string>ele.getAttribute(Constants.props.DATA_UNIT_BLOCK_TYPE),
                    value: <string>ele.getAttribute(Constants.props.DATA_UNIT_BLOCK_VALUE),
                }
            },
        }
    }
}