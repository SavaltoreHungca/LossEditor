import { MemLoss } from '../../MemLoss';
import { Element } from "../Element";
import { innerHtml, $$, $ } from 'utils';
import { ScrollPage } from 'scroll-page';
import { Pad } from '../elementTypes';

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

        return {
            render: function () {
                innerHtml(introductionPad, `
                    <div style="wdith: 100%; height: 100%; display: flex; flex-direction: column;">
                        <div style="display: flex; flex-direction: column; height: 100%; width: calc(100% - 40px);margin: 0 auto; text-align: center; justify-content: center;">
                            <div style="font-size: 100px">${$$.randomEmoji()}</div>
                            <div>没有人比我更懂怎么做笔记 !</div>
                        </div>
                    </div>
                `, true);

                introductionPad.setStyle({ display: 'block'})
            },
            disappear: function(){
                introductionPad.setStyle({ display: 'none'})
            }
        };
    }
}
