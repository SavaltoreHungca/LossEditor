import { ScrollPage } from "../ScrollPage"
import { Element } from './Element';

export interface Container extends Element { }

export function containerExt(sp: ScrollPage) {
    return (ele: HTMLElement) => {
        return {
            getType: () => 'Container'
        }
    }
}