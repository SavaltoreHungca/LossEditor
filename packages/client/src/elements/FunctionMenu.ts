import { Element } from './Element';
import { MemLoss } from '../MemLoss';
import { innerHtml } from 'utils';

export interface FunctionMenu extends Element {

}

export function functionMenuExt(memloss: MemLoss) {
    return (functionMenu: Element) => {
        innerHtml(functionMenu, `
            <div class="background-change-selected" style="cursor: pointer;display: flex; align-items: center; min-height: 27px; font-size: 14px; width: 100%;">
                <div style="flex-shrink: 0; flex-grow: 0; border-radius: 3px; color: rgba(55, 53, 47, 0.6); width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; margin-right: 4px;">
                    <i class="fa fa-cog" aria-hidden="true"></i>
                </div>
                <div style="flex: 1 1 auto; white-space: nowrap; min-width: 0px; overflow: hidden; text-overflow: ellipsis;">
                    Settings &amp; Members
                </div>
            </div>
            <div class="background-change-selected" style="cursor: pointer;display: flex; align-items: center; min-height: 27px; font-size: 14px; width: 100%;">
                <div style="flex-shrink: 0; flex-grow: 0; border-radius: 3px; color: rgba(55, 53, 47, 0.6); width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; margin-right: 4px;">
                    <i class="fa fa-search" aria-hidden="true"></i>
                </div>
                <div style="flex: 1 1 auto; white-space: nowrap; min-width: 0px; overflow: hidden; text-overflow: ellipsis;">
                    Quick Search
                </div>
            </div>
        `)
        return {};
    }
}
