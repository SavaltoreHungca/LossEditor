import { Editor } from "../../Editor";
import { $$, ElementInfo } from "utils";
import { Style, UiNodeTypes } from "../elementTypes";

export function uiExt(editor: Editor, uiNodeType: UiNodeTypes) {
    return (ele: HTMLElement) => {
        ele.setAttribute('data-editor-type', uiNodeType);

        return {
            getStyle: function (): Style | undefined {
                return ele['ele-style-2ca4a51'];
            },
            setStyle: function (style: Style | undefined) {
                if (!style) return;
                $$.setStyle(ele, style);
                ele['ele-style-2ca4a51'] = style;
            },
            getInfo: function (): ElementInfo {
                return $$.getElementInfo(ele);
            }
        }
    }
}