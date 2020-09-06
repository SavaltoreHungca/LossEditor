import { MemLoss } from './../MemLoss';
import { Element } from "./Element";
import { Pad } from "./elementTypes";

export interface RssListPad extends Element, Pad {

}

export function rssListPadExt(memloss: MemLoss) {
    return (rssListPad: Element) => {

        const ext = {
            render: function () {
            },
            disappear: function () {
                rssListPad.setStyle({ display: 'none' })
            }
        }

        return ext;
    }
}