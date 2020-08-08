import { ScrollPage } from "../ScrollPage"
import { Element } from './Element';

export interface RightScrollBar extends Element { }

export function rightScrollBarExt(sp: ScrollPage) {
    return (ele: HTMLElement) => {
        return {
            getType: () => 'RightScrollBar'
        }
    }
}