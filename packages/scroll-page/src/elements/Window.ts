import { ScrollPage } from "../ScrollPage"
import { Element } from './Element';

export interface Window extends Element { }

export function windowExt(sp: ScrollPage) {
    return (ele: HTMLElement) => {
        ele.addEventListener('scroll', (e: Event)=>{
            ele.scrollLeft = 0;
            ele.scrollTop = 0;
        })

        return {
            getType: () => 'Window'
        }
    }
}