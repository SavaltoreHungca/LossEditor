import { Element } from './Element';
import { MemLoss } from '../MemLoss';
import { innerHtml, $$, $, ct } from 'utils';
import { creEle } from './elementTypes';
import isHotkey from 'is-hotkey';

export interface GlobalSearch extends Element {
    toggleShow(showIt?: boolean): void
    toggleResultShow(showIt?: boolean): void
    isShown: boolean
}

export function globalSearchExt(memloss: MemLoss) {
    const idset = {
        serachInput: $$.randmonId(),
    }

    return (globalSearch: Element) => {

        globalSearch.setStyle({
            position: 'fixed',
            left: '50%',
            top: '20%',
            transform: 'translate(-50%, 0)',
            'z-index': '102',
            display: 'none',
            outline: 'none',
        });
        globalSearch.setAttribute('tabindex', '1');

        innerHtml(globalSearch, `
            <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="width: fit-content; border-radius: 3px; background: white; position: relative; box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px;">
                    <div style="width: fit-content; display: flex; align-items: center;">
                        <span style="font-size: 33px; padding: 10px;">
                            <i class="fa fa-search" aria-hidden="true"></i>
                        </span>
                        <input id="${idset.serachInput}"
                            style="
                                display: block;
                                width: 500px;
                                height: calc(1.5em + .75rem + 2px);
                                padding: .375rem .75rem;
                                font-size: 1rem;
                                font-weight: 400;
                                line-height: 1.5;
                                color: #495057;
                                background-color: #fff;
                                background-clip: padding-box;
                                border: none;
                                border-radius: .25rem;
                                transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
                                border: none;
                                outline: none;
                                font-size: 26px;
                            "
                            placeholder="Search everything"
                        ></input>
                    </div>
                </div>

                <div style="display: none; width: 568px; margin-top: 8px; border-radius: 3px; background: white; position: relative; box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px;">
                    hello
                </div>
            </div>
        `)

        $$.stopPropagation(globalSearch, 'click');
        globalSearch.addEventListener('keydown', (evt: KeyboardEvent)=>{
            if(isHotkey('mod+p', evt)) evt.preventDefault();
        })

        ct<HTMLInputElement>($(idset.serachInput)).addEventListener('change', ()=>{
            const value = ct<HTMLInputElement>($(idset.serachInput)).value;
        })

        const ext = {
            toggleShow: function (showIt?: boolean) {
                if (typeof showIt === 'undefined') {
                    showIt = ! ct<GlobalSearch>(globalSearch).isShown;
                }
                if (showIt) {
                    globalSearch.removeStyle('display');
                    $(idset.serachInput).focus();
                }
                else {
                    globalSearch.setStyle({ display: 'none' });
                    window.focus();
                    ct<HTMLInputElement>($(idset.serachInput)).value = '';
                }
                ct<GlobalSearch>(globalSearch).isShown = showIt;
            },
            isShown: false
        };

        document.addEventListener('click', ()=>{
            ext.toggleShow(false);
        })

        window.addEventListener('keydown', (ev: KeyboardEvent)=>{
            if(isHotkey('mod+p', ev)){
                ev.preventDefault();
                memloss.globalSearch.toggleShow();
                return;
            }
            if(isHotkey('esc', ev) && memloss.globalSearch.isShown){
                memloss.globalSearch.toggleShow(false);
                return;
            }
        })

        return ext;
    }
}
