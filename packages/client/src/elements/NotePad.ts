import { MemLoss } from './../MemLoss';
import { Element } from "./Element";
import { Node } from "../repository/transferTypes";
import { innerHtml, $$, $ } from 'utils';
import { ScrollPage } from 'scroll-page';
import { Pad } from './RightSidePad';

export interface NotePad extends Element, Pad {
}

export function notePadExt(memloss: MemLoss) {
    return (notePad: Element) => {
        notePad.setStyle({
            width: '100%',
            height: '100%',
            background: 'white',
            display: 'none'
        })

        const idset = {
            crumbs: $$.randmonId(),
            crumbsSp: $$.randmonId(),
            crumbsList: $$.randmonId(),
        }

        innerHtml(notePad, `
            <div style="wdith: 100%; height: 100%; display: flex; flex-direction: column;">
                <div id="${idset.crumbs}" style="height: 35px">
                    <div id="${idset.crumbsSp}">
                        <div id="${idset.crumbsList}" style="height: 35px; white-space: nowrap; width: fit-content">
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                            <div style="display: inline-block">稀巴</div>
                        </div>
                    </div>
                </div>
                <div style="flex-grow: 1">

                </div>
                <div style="height: 22px">

                </div>
            </div>
        `)

        const crumbsSp = new ScrollPage({
            lazyInit: true, 
            showTopShallow: false,
            bottomScrollBarHeight: 5,
            hiddenRightScrollBar: true,
            containerHeight: 35,
        })

        return {
            render: function () {
                notePad.setStyle({ display: 'block'})
                crumbsSp.init({
                    container: $(idset.crumbsSp),
                });
                crumbsSp.containerSizeFollowOuter();
            },
            disappear: function(){
                notePad.setStyle({ display: 'none'})
            }
        };
    }
}
