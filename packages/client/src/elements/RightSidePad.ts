import { MemLoss } from './../MemLoss';
import { Element } from "./Element";
import { NotePad } from './NotePad';
import { creEle } from './elementTypes';
import { ct } from 'utils';

export interface Pad {
    render(): void
    disappear(): void
}

export interface PadTypsMap {
    notePad: NotePad
}

const padList: Array<keyof PadTypsMap> = ['notePad'];

export interface RightSidePad extends Element, PadTypsMap {
    switchPad<K extends keyof PadTypsMap>(name: K): void
}

export function rightSidePadExt(memloss: MemLoss) {
    return (rightSidePad: Element) => {

        const ext = {
            switchPad: function <K extends keyof PadTypsMap>(name: K) {
                for (const padType in padList) {
                    if (padType !== name) {
                        ct<Pad>(this[padType]).disappear();
                    }
                }
                ct<Pad>(this[name]).render();
            },
            notePad: creEle(memloss, 'notePad'),
        };

        rightSidePad.appendChild(ext.notePad);

        return;
    }
}