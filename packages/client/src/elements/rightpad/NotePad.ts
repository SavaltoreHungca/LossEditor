import { MemLoss } from '../../MemLoss';
import { Element } from "../Element";
import { innerHtml, $$, $, MapObj } from 'utils';
import { ScrollPage } from 'scroll-page';
import { Pad, creEle } from '../elementTypes';
import { Constants } from '../../Constants';
import { Editor } from 'editor';
import { NoteTab } from './NoteTab';

export interface NotePad extends Element, Pad {
    openTab(tabInfo: { id: string, name: string, content: string }): void
    updateSize(): void
    tabList: Array<NoteTab>
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
            crumbsSp: $$.randmonId(),
            crumbsList: $$.randmonId(),

            noteContent: $$.randmonId(),
            noteFootBar: $$.randmonId()
        }

        let shown = false;

        innerHtml(notePad, `
            <div style="wdith: 100%; height: 100%; display: flex; flex-direction: column;">
                <div style="height: ${notePadTabsHeight}px; background: rgb(247, 246, 243); overflow: hidden; ">
                    <div id="${idset.crumbsSp}">
                        <div id="${idset.crumbsList}" style="height: ${notePadTabsHeight}px; 
                            white-space: nowrap; width: fit-content;">
                        </div>
                    </div>
                </div>
                <div style="flex-grow: 1; overflow: hidden; height: 0">
                    <div id="${idset.noteContent}"></div>
                </div>
                <div id="${idset.noteFootBar}" style="height: 22px; overflow: hidden; "></div>
            </div>
        `);

        const crumbsSp = new ScrollPage({
            lazyInit: true,
            showTopShallow: false,
            bottomScrollBarHeight: 5,
            hiddenRightScrollBar: true,
            containerHeight: 35,
        })

        const editor = new Editor({
            lazyInit: true,
            width: 2000,
            height: 2000,
        });

        const ext = {
            render: function () {
                notePad.setStyle({ display: 'block' })
                crumbsSp.init({
                    container: $(idset.crumbsSp),
                });

                editor.setSettings({
                    container: $(idset.noteContent),
                })

                this.updateSize()
                shown = true;
            },
            disappear: function () {
                notePad.setStyle({ display: 'none' })
                shown = false;
            },
            openTab: function (tabInfo: { id: string, name: string, content: string | MapObj }) {

                const noteTab = creEle(memloss, 'noteTab');
                $(idset.crumbsList).appendChild(noteTab);
                noteTab.render(tabInfo.name, tabInfo.id);

                editor.render(tabInfo.content);
                this.tabList.push(noteTab);
                
                this.updateSize();
            },
            updateSize: function () {
                if(shown){
                    crumbsSp.containerSizeFollowOuter();
                    editor.sizeFollowOutContainer();
                }
            },
            tabList: new Array<NoteTab>(),
        };

        memloss.eventManager.bindEventOn(Constants.events.RESIZBAR_RESIZING, () => {
            ext.updateSize();
        })

        return ext;
    }
}
