import { ScrollPage } from "../ScrollPage"
import { Element } from './Element';

export interface Page extends Element { }

export function pageExt(sp: ScrollPage) {
    return (ele: HTMLElement) => {
        return {
            getType: () => 'Page'
        }
    }
}