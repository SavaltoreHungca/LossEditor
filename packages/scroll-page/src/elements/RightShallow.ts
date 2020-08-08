import { ScrollPage } from "../ScrollPage"
import { Element } from './Element';

export interface RightShallow extends Element { }

export function rightShallowExt(sp: ScrollPage) {
    return (ele: HTMLElement) => {
        return {
            getType: () => 'RightShallow'
        }
    }
}