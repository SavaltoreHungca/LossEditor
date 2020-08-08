import { ScrollPage } from "../ScrollPage"
import { Element } from './Element';

export interface Window extends Element { }

export function windowExt(sp: ScrollPage) {
    return (ele: HTMLElement) => {
        return {
            getType: () => 'Window'
        }
    }
}