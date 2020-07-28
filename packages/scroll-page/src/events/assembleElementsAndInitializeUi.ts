import Constants from "../Constants";
import { ScrollPage } from "../ScrollPage";
import { $$, DragState, $, extend, innerHtml } from "utils";
import { eleExt, windowExt, Window, Page, pageExt, RightScrollBar, RightSlider, ButtomScrollBar, ButtomSlider, TopShallow, RightShallow, rightScrollBarExt, rightSliderExt, buttomScrollBarExt, buttomSliderExt, topShallowExt, rightShallowExt } from "../elementTyps";

export function assembleElementsAndInitializeUi(sp: ScrollPage) {
    // 组装元素事件
    // 初始化样式, 位置, 尺寸
    sp.eventManager.registryEventDpendsOn([Constants.events.ELEMENTS_CREATED],
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
                <div data-scrollpage-type="window" id="${idset.window}" style="overflow: hidden">
                    <div data-scrollpage-type="page" id="${idset.page}" 
                        style="contain: strict; overflow: hidden; left: 0; top: 0"></div>
                </div>
                <div data-scrollpage-type="rightScrollBar" id="${idset.rightScrollBar}" 
                    style="z-index: 100; right: 0; top: 0; width: ${sp.settings.rightScrollBarWidth}px">
                    <div data-scrollpage-type="rightSlider" id="${idset.rightSlider}" 
                        style="background: hsla(0,0%,39%,.4); width: ${sp.settings.rightScrollBarWidth}px"></div>
                </div>
                <div data-scrollpage-type="buttomScrollBar" id="${idset.buttomScrollBar}" 
                    style="z-index: 100; height: ${sp.settings.bottomScrollBarHeight}px; left: 0; bottom: 0 ">
                    <div data-scrollpage-type="buttomSlider" id="${idset.buttomSlider}" 
                        style="background: hsla(0,0%,39%,.4); height: ${sp.settings.bottomScrollBarHeight}px"></div>
                </div>
                <div data-scrollpage-type="topshallow" id="${idset.topshallow}" 
                    style="box-shadow: #dddddd 0 6px 6px -6px inset; height: 6px; left: 0; top: 0">
                </div>
                <div data-scrollpage-type="rightshallow" id="${idset.rightshallow}" 
                    style="box-shadow: #dddddd -6px 0 6px -6px inset; width: 6px; top: 0">
                </div>
            `)

            sp.elements.window = <Window>extend($$.wrapEle('block', $(idset.window)), [eleExt(sp), windowExt(sp)]);
            sp.elements.page = <Page>extend($$.wrapEle('absolute', $(idset.page)), [eleExt(sp), pageExt(sp)]);
            sp.elements.rightScrollBar = <RightScrollBar>extend($$.wrapEle('absolute', $(idset.rightScrollBar)), [eleExt(sp), rightScrollBarExt(sp)]);
            sp.elements.rightSlider = <RightSlider>extend($$.wrapEle('absolute', $(idset.rightSlider)), [eleExt(sp), rightSliderExt(sp)]);
            sp.elements.buttomScrollBar = <ButtomScrollBar>extend($$.wrapEle('absolute', $(idset.buttomScrollBar)), [eleExt(sp), buttomScrollBarExt(sp)]);
            sp.elements.buttomSlider = <ButtomSlider>extend($$.wrapEle('absolute', $(idset.buttomSlider)), [eleExt(sp), buttomSliderExt(sp)]);
            sp.elements.topshallow = <TopShallow>extend($$.wrapEle('absolute', $(idset.topshallow)), [eleExt(sp), topShallowExt(sp)]);
            sp.elements.rightshallow = <RightShallow>extend($$.wrapEle('absolute', $(idset.rightshallow)), [eleExt(sp), rightShallowExt(sp)]);

            const { rightshallow, page } = sp.elements;
            page.appendChild(content);

            if (sp.settings.rightScrollBarInner) {
                rightshallow.setRight('0');
            } else {
                rightshallow.setRight(sp.settings.rightScrollBarWidth + 'px');
            }

            // sp.updateContainerSize();
            sp.updatePageSize();

        }, Constants.events.ASSEMBLE_ELEMENTS_FINISH)
}