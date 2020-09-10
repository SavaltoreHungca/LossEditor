import { ct, $$, mouseHover, $ } from 'utils';
import { innerHtml } from 'utils';
import { Element } from "../Element";
import { MemLoss } from "../../MemLoss";
import { classes } from '../../styleClassSheet';

export interface NoteTab extends Element {
    render(name: string, id: string): void
    tabId: string
    selected: boolean
}

export function noteTabExt(memloss: MemLoss) {
    const { notePadTabsHeight } = memloss.settings;
    return (noteTab: Element) => {
        noteTab.setStyle({
            cursor: 'pointer',
            'box-sizing': 'border-box',
            height: notePadTabsHeight
        })

        let rendered = false;

        return {
            render: function (name: string, id: string) {
                if (rendered) {
                    return;
                }
                this.tabId = ct(id);

                const idset = {
                    closer: $$.randmonId()
                }
                innerHtml(noteTab, `
                    <div style="display: flex; flex-direction: column; 
                                justify-content: center;height: ${notePadTabsHeight}px;
                                ">
                        <div>
                            <div style="max-width: 125px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    padding: 0 5px;
                                    display: inline-block;
                                    vertical-align: middle;
                                    ">
                                ${name}
                            </div>
                            <i id="${idset.closer}" style="vertical-align: middle; margin-left: 7px; opacity: 0;" class="fa fa-times" aria-hidden="true"></i>
                        </div>
                    </div>
                `, true)
                mouseHover(noteTab, (status) => {
                    switch (status) {
                        case 'hover': $$.setStyle($(idset.closer), { opacity: 1 }); break;
                        case 'leave': $$.setStyle($(idset.closer), { opacity: 0 }); break;
                    }
                })

                noteTab.onclick = ()=>{
                    noteTab.addClass(classes.tabSelected);
                    $$.setStyle($(idset.closer), { opacity: 1 });
                }

                rendered = true;
            },
            tabId: undefined,
            selected: false
        }
    }
}