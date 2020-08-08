import { ScrollPage } from "../ScrollPage"
import { Element } from './Element';

export interface ButtomScrollBar extends Element { }

export function buttomScrollBarExt(sp: ScrollPage) {
    return (ele: HTMLElement) => {
        return {
            getType: () => 'ButtomScrollBar'
        }
    }
}