import { ScrollPage } from "../ScrollPage"
import { Element } from './Element';
import { ct } from "utils";

export interface Container extends Element { }

export function containerExt(sp: ScrollPage) {
    return (ele: HTMLElement) => {
        ct<any>(ele).sp = sp;
        return {
            getType: () => 'Container'
        }
    }
}