import Constants from "../Constants";
import { ScrollPage } from "../ScrollPage";
import { $$, $, innerHtml } from "utils";
import { creEle } from "../elementTyps";
import { classes } from '../styleClassSheet'

export function assembleElementsAndInitializeUi(sp: ScrollPage) {
    // 组装元素事件
    // 初始化样式, 位置, 尺寸
    sp.eventManager.bindEventAtLeastExecOnceOn([Constants.events.ELEMENTS_CREATED],
        Constants.events.ASSEMBLE_ELEMENTS_FINISH,
        () => {
            const { container, content } = sp.elements;
            const idset = {
                window: $$.randmonId(),
                page: $$.randmonId(),
                rightScrollBar: $$.randmonId(),
                rightSlider: $$.randmonId(),
                buttomScrollBar: $$.randmonId(),
                buttomSlider: $$.randmonId(),
                topshallow: $$.randmonId(),
                rightshallow: $$.randmonId(),
            }
            container.setStyle({
                position: 'relative',
                overflow: 'hidden',
                width: sp.settings.containerWidth,
                height: sp.settings.containerHeight,
            })

            innerHtml(container, `
                <div id="${idset.window}" style="overflow: hidden">
                    <div id="${idset.page}" 
                        style="contain: strict; overflow: hidden; left: 0; top: 0"></div>
                </div>
                <div id="${idset.rightScrollBar}" 
                    style="z-index: 100; right: 0; top: 0; width: ${sp.settings.rightScrollBarWidth}px">
                    <div class="${classes.sliderhover}" id="${idset.rightSlider}" 
                        style="width: ${sp.settings.rightScrollBarWidth}px"></div>
                </div>
                <div id="${idset.buttomScrollBar}" 
                    style="z-index: 100; height: ${sp.settings.bottomScrollBarHeight}px; left: 0; bottom: 0 ">
                    <div class="${classes.sliderhover}" id="${idset.buttomSlider}" 
                        style="height: ${sp.settings.bottomScrollBarHeight}px"></div>
                </div>
                <div id="${idset.topshallow}" 
                    style="box-shadow: #dddddd 0 6px 6px -6px inset; height: 6px; left: 0; top: 0">
                </div>
                <div id="${idset.rightshallow}" 
                    style="box-shadow: #dddddd -6px 0 6px -6px inset; width: 6px; top: 0">
                </div>
            `)

            sp.elements.window = creEle(sp, 'window', $(idset.window));
            sp.elements.page = creEle(sp, 'page', $(idset.page));
            sp.elements.rightScrollBar = creEle(sp, 'right-scrollbar', $(idset.rightScrollBar));
            sp.elements.rightSlider = creEle(sp, 'right-slider', $(idset.rightSlider));
            sp.elements.buttomScrollBar = creEle(sp, 'buttom-scrollbar', $(idset.buttomScrollBar));
            sp.elements.buttomSlider = creEle(sp, 'buttom-slider', $(idset.buttomSlider));
            sp.elements.topshallow = creEle(sp, 'top-shallow', $(idset.topshallow));
            sp.elements.rightshallow = creEle(sp, 'right-shallow', $(idset.rightshallow));

            const { rightshallow, page } = sp.elements;
            page.appendChild(content);

            if (sp.settings.rightScrollBarInner) {
                rightshallow.setRight('0');
            } else {
                rightshallow.setRight(sp.settings.rightScrollBarWidth);
            }

            // sp.updateContainerSize();
            sp.updatePageSize();
        })
}