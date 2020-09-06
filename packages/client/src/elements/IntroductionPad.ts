import { MemLoss } from './../MemLoss';
import { Element } from "./Element";
import { innerHtml, $$, $ } from 'utils';
import { ScrollPage } from 'scroll-page';
import { Pad } from './elementTypes';

export interface IntroductionPad extends Element, Pad {
}

export function introductionPadExt(memloss: MemLoss) {
    return (introductionPad: Element) => {
        introductionPad.setStyle({
            width: '100%',
            height: '100%',
            background: 'white',
            display: 'none'
        })

        innerHtml(introductionPad, `
            <div style="wdith: 100%; height: 100%; display: flex; flex-direction: column;">
                介绍
            </div>
        `)

        return {
            render: function () {
                introductionPad.setStyle({ display: 'block'})
            },
            disappear: function(){
                introductionPad.setStyle({ display: 'none'})
            }
        };
    }
}
