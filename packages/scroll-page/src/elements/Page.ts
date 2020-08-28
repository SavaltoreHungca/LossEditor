import { ScrollPage } from "../ScrollPage"
import { Element } from './Element';

export interface Page extends Element { }

export function pageExt(sp: ScrollPage) {
    return (ele: HTMLElement) => {
        ele.addEventListener('scroll', (e: Event)=> {
            ele.scrollLeft = 0;
            ele.scrollTop = 0;
            sp.pageSizeFollowContent();
        })

        return {
            getType: () => 'Page'
        }
    }
}