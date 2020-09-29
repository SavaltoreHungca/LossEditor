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
            tab: $$.randmonId(),
        }

        innerHtml(noteTab, `
            <div id="${idset.tab}" style="display: flex; flex-direction: column; 
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

                this.addContextMenu();

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
            savedData: Nil,
            addContextMenu: function(){
                const menuidset = {
                    closeall: $$.randmonId()
                }

                $$.addContextMenu($(idset.tab), (menu, opt, evt)=>{
                    innerHtml(menu, `
                        <div style="width: fit-content; border-radius: 3px; background: white; position: relative; box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px; z-index: 102">
                            <div style="display: flex; flex-direction: column; width: 220px; height: 100%;">
                                ${getContextMenuItem(menuidset.closeall, 'Close all', 'fa-times')}
                            </div>
                        </div>
                    `)
                })
            }
        }
    }
}

function getContextMenuItem(id: string, name: string, tagType: string) {
    return `
        <div id="${id}" class="${classes.backChSelectd}" style="display: flex; align-items: center; line-height: 120%; width: 100%; user-select: none; min-height: 28px; font-size: 14px;">
            <div style="display: flex; align-items: center; justify-content: center; margin-left: 14px;">
                <i class="fa ${tagType}" aria-hidden="true"></i>
            </div>
            <div style="padding-left: 5px">
                ${name}
            </div>
        </div>
    `
}