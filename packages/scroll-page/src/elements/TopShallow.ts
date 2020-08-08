import { ScrollPage } from "../ScrollPage"
import { Element } from './Element';

export interface TopShallow extends Element { }

export function topShallowExt(sp: ScrollPage) {
    return (ele: HTMLElement) => {
        return {
            getType: () => 'TopShallow'
        }
    }
}