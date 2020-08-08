import { ScrollPage } from "../ScrollPage"
import { Element } from './Element';

export interface Content extends Element { }

export function contentExt(sp: ScrollPage) {
    return (ele: HTMLElement) => {
        return {
            getType: () => 'Content'
        }
    }
}