import { MemLoss } from '../../MemLoss';
import { Element } from "../Element";
import { innerHtml, $$, $ } from 'utils';
import { ScrollPage } from 'scroll-page';
import { Pad, creEle } from '../elementTypes';
import { Constants } from '../../Constants';

export interface NotePad extends Element, Pad {
    openTab(
        tabInfo: {id: string, name: string},
        renderMethod: (noteContent: HTMLElement, noteFootBar: HTMLElement)=>void
    ): void
    updateSize(): void

}

export function notePadExt(memloss: MemLoss) {
    return (notePad: Element) => {
        const { notePadTabsHeight } = memloss.settings

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
            noteContent: $$.randmonId(),
            noteFootBar: $$.randmonId()
        }

        let shown = false;

        innerHtml(notePad, `
            <div style="wdith: 100%; height: 100%; display: flex; flex-direction: column;">
                <div id="${idset.crumbs}" style="height: ${notePadTabsHeight}px; background: rgb(247, 246, 243);">
                    <div id="${idset.crumbsSp}">
                        <div id="${idset.crumbsList}" style="height: ${notePadTabsHeight}px; 
                            white-space: nowrap; width: fit-content;">
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

        const ext = {
            render: function () {
                notePad.setStyle({ display: 'block' })
                crumbsSp.init({
                    container: $(idset.crumbsSp),
                });
                this.updateSize()
                shown = true;
            },
            disappear: function () {
                notePad.setStyle({ display: 'none' })
                shown = false;
            },
            openTab: function (
                tabInfo: {id: string, name: string},
                renderMethod: (noteContent: HTMLElement, noteFootBar: HTMLElement)=>void
            ) {
                const noteTab = creEle(memloss, 'noteTab');
                $(idset.crumbsList).appendChild(noteTab);
                noteTab.render(tabInfo.name, tabInfo.id);
                this.updateSize();
            },
            updateSize: function(){
                crumbsSp.containerSizeFollowOuter();
            }
        };

        memloss.eventManager.bindEventOn(Constants.events.RESIZBAR_RESIZING, () => {
            ext.updateSize();
        })

        return ext;
    }
}
