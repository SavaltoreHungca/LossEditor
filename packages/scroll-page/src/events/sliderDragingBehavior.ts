import { ScrollPage } from "../ScrollPage";
import { DragState, $$ } from "utils";
import Constants from "../Constants";

export function sliderDragingBehavior(sp: ScrollPage) {
    sp.eventManager.bindEventOn(Constants.events.ASSEMBLE_ELEMENTS_FINISH, () => {
        buttomSliderBehavior(sp);
        rightSliderBehavior(sp);
    })

}

function buttomSliderBehavior(sp: ScrollPage) {
    const { buttomSlider } = sp.elements;
    if (!buttomSlider) throw new Error();

    // 拖动底部 slider 的拖动事件
    buttomSlider.addDragEvent((e: DragState) => {
        const { page, buttomScrollBar, rightshallow, buttomSlider } = sp.elements;
        if (!buttomSlider || !buttomScrollBar || !page) throw new Error();

        if (e.pressed === false) { // 拖动事件结束
            buttomSlider.lightenColor();
            buttomSlider.dragging = false;
            return;
        }

        buttomSlider.dragging = true;
        buttomSlider.darkenColor();
        const buttomSliderInfo = buttomSlider.getInfo();
        let buttomScrollBarInfo = buttomScrollBar.getInfo();
        let pageInfo = page.getInfo();

        let offset = buttomSliderInfo.left + e.deltaX;

        if (offset <= 0) {
            offset = 0;
        } else if (offset >= buttomScrollBarInfo.innerWidth - buttomSliderInfo.innerWidth) {
            offset = buttomScrollBarInfo.innerWidth - buttomSliderInfo.innerWidth;
        }
        buttomSlider.setLeft(offset);
        page.setLeft(- Math.ceil(pageInfo.innerWidth / buttomScrollBarInfo.innerWidth * offset));
    })
}

function rightSliderBehavior(sp: ScrollPage) {
    const { rightSlider } = sp.elements;
    if (!rightSlider) throw new Error();

    // 拖动底部 slider 的拖动事件
    rightSlider.addDragEvent((e: DragState) => {
        if (e.pressed === false) { // 拖动事件结束
            rightSlider.lightenColor();
            rightSlider.dragging = false;
            return;
        }
        rightSlider.dragging = true;
        rightSlider.darkenColor();
        const { page, rightScrollBar } = sp.elements;
        if (!rightScrollBar || !page) throw new Error();

        const rightSliderInfo = rightSlider.getInfo();
        const rightScrollBarInfo = rightScrollBar.getInfo();
        const pageInfo = page.getInfo();

        let offset = rightSliderInfo.top + e.deltaY;
        if (offset <= 0) {
            offset = 0;
        } else if (offset >= rightScrollBarInfo.innerHeight - rightSliderInfo.innerHeight) {
            offset = rightScrollBarInfo.innerHeight - rightSliderInfo.innerHeight;
        }
        rightSlider.setTop(offset);
        page.setTop(- pageInfo.innerHeight / rightScrollBarInfo.innerHeight * offset);
    })
}