import { ct, $$, mouseHover, $, Nil } from 'utils';
import { innerHtml } from 'utils';
import { Element } from "../Element";
import { MemLoss } from "../../MemLoss";
import { classes } from '../../styleClassSheet';

export interface NoteTab extends Element {
    render(name: string, id: string, content: any): void
    tabId: string
    selected: boolean
    setCloserOpacity(value: number): void
    toggleSelected(isSelected?: boolean, callback?: (isSelected: boolean) => void): void
    savedData: any
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


        const idset = {
            closer: $$.randmonId(),
            name: $$.randmonId(),
        }

        innerHtml(noteTab, `
            <div style="display: flex; flex-direction: column; 
                        justify-content: center;height: ${notePadTabsHeight}px;
                        ">
                <div>
                    <div id="${idset.name}" style="max-width: 125px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            padding: 0 5px;
                            display: inline-block;
                            vertical-align: middle;
                            ">
                    </div>
                    <i id="${idset.closer}" style="vertical-align: middle; margin-left: 7px; opacity: 0;" class="fa fa-times" aria-hidden="true"></i>
                </div>
            </div>
        `, true)


        return {
            render: function (name: string, id: string, content: any) {
                if (rendered) {
                    return;
                }

                this.tabId = ct(id);
                this.savedData = content;
                $(idset.name).innerHTML = name;

                mouseHover(noteTab, (status) => {

                    if (this.selected) return;

                    switch (status) {
                        case 'hover': $$.setStyle($(idset.closer), { opacity: 1 }); break;
                        case 'leave': $$.setStyle($(idset.closer), { opacity: 0 }); break;
                    }
                })

                noteTab.addEventListener('click', (evt) => {
                    evt.stopPropagation();
                    memloss.notePad.switchTab(this.tabId);
                })
                $(idset.closer).addEventListener('click', (evt) => {
                    evt.stopPropagation();
                    memloss.notePad.closeTab(this.tabId);
                })

                rendered = true;
            },
            tabId: Nil,
            selected: false,
            setCloserOpacity: function (value: number) {
                $$.setStyle($(idset.closer), { opacity: value });
            },
            toggleSelected: function (isSelected?: boolean, callback?: (isSelected: boolean) => void) {
                if (typeof isSelected === 'undefined') {
                    isSelected = !this.selected;
                }

                if (isSelected) {
                    memloss.notePad.tabList.forEach((it) => {
                        it.removeClass(classes.tabSelected);
                        it.selected = false;
                        it.setCloserOpacity(0);
                    })
                    noteTab.addClass(classes.tabSelected);
                    this.setCloserOpacity(1);
                    this.selected = true;
                }
                else {
                    noteTab.removeClass(classes.tabSelected);
                    this.selected = false;
                    this.setCloserOpacity(0);
                }

                if (callback) {
                    callback(isSelected);
                }
            },
            savedData: Nil
        }
    }
}