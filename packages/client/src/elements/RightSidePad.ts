import { MemLoss } from './../MemLoss';
import { Element } from "./Element";
import { NotePad } from './NotePad';
import { creEle } from './elementTypes';
import { ct } from 'utils';
import { IntroductionPad } from './IntroductionPad';

export interface Pad {
    render(): void
    disappear(): void
}

export interface PadTypsMap {
    notePad: NotePad
    introductionPad: IntroductionPad
}

const padList: Array<keyof PadTypsMap> = ['notePad', 'introductionPad'];

export interface RightSidePad extends Element, PadTypsMap {
    switchPad<K extends keyof PadTypsMap>(name: K): void
}

export function rightSidePadExt(memloss: MemLoss) {
    return (rightSidePad: Element) => {

        const ext = {
            switchPad: function <K extends keyof PadTypsMap>(name: K) {
                for (const padType of padList) {
                    if (padType !== name) {
                        ct<Pad>(this[padType]).disappear();
                    }
                }
                ct<Pad>(this[name]).render();
            },
            notePad: creEle(memloss, 'notePad'),
            introductionPad: creEle(memloss, 'introductionPad')
        };

        rightSidePad.appendChild(ext.notePad);
        rightSidePad.appendChild(ext.introductionPad);

        return ext;
    }
}