import { MemLoss } from './../MemLoss';
import { Element } from "./Element";
import { innerHtml, $$, $, ct } from 'utils';
import { ResizeBar } from './ResizeBar';
import { FunctionMenu } from './FunctionMenu';
import { NodeListPad } from './NodeListPad';
import { creEle, Pad } from './elementTypes';
import { RssListPad } from './RssListPad';

interface PadTypsMap {
    nodeListPad: NodeListPad
    rssListPad: RssListPad
}

const padList: Array<keyof PadTypsMap> = ['nodeListPad', 'rssListPad'];

export interface LeftDirectoryTree extends Element {
    switchPad<K extends keyof PadTypsMap>(name: K): void
}

export function leftDirectoryTreeExt(memloss: MemLoss) {
    return (leftSidePad: Element) => {

        const ext = {
            switchPad: function <K extends keyof PadTypsMap>(name: K) {
                for (const padType of padList) {
                    if (padType !== name) {
                        ct<Pad>(this[padType]).disappear();
                    }
                }
                ct<Pad>(this[name]).render();
            },
            nodeListPad: creEle(memloss, 'nodeListPad'),
            rssListPad: creEle(memloss, 'rssListPad')
        };

        memloss.nodeListPad = ext.nodeListPad;
        leftSidePad.appendChild(ext.nodeListPad);
        leftSidePad.appendChild(ext.rssListPad);

        return ext;
    }
}