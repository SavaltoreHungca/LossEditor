import Constants from "../Constants";
import { ScrollPage } from "../ScrollPage";

export function setScrollBar(scrollPage: ScrollPage) {
    // 设定底部滚动条 slider 的宽度
    // 是否显示底部滚动条
    scrollPage.eventManager.bindEventOnMany([
        Constants.events.ASSEMBLE_ELEMENTS_FINISH,
        Constants.events.BUTTOMSCROLLBAR_WIDTH_CHANGE,
        Constants.events.PAGE_WIDTH_CHANGE
    ], () => {
        let { page, buttomScrollBar, buttomSlider, window } = scrollPage.elements;
        if (!page || !buttomSlider || !window || !buttomScrollBar) throw new Error();

        if (!scrollPage.settings.hiddenBottomScrollBar) {
            const pageInfo = page.getInfo();
            const buttomScrollBarInfo = buttomScrollBar.getInfo();
            const windowInfo = window.getInfo();
            if (pageInfo.innerWidth <= windowInfo.innerWidth) {
                buttomScrollBar.disappear();
            } else {
                if (!scrollPage.settings.bottomScrollBarInner) {
                    buttomScrollBar.show();
                }
                const sliderWidth = Math.pow(buttomScrollBarInfo.innerWidth, 2) / pageInfo.innerWidth;
                buttomSlider.setWidth(sliderWidth);
            }
        } else {
            buttomScrollBar.disappear();
        }
    })

    // 设定右部滚动条 slider 的高度
    // 是否显示右部滚动条
    scrollPage.eventManager.bindEventOnMany([
        Constants.events.ASSEMBLE_ELEMENTS_FINISH,
        Constants.events.RIGHTSCROLLBAR_WIDTH_CHANGE,
        Constants.events.PAGE_HEIGHT_CHANGE
    ], () => {
        let { page, rightScrollBar, rightSlider, window } = scrollPage.elements;
        if (!page || !rightScrollBar || !window || !rightSlider) throw new Error();

        if (!scrollPage.settings.hiddenRightScrollBar) {
            const pageInfo = page.getInfo();
            const windowInfo = window.getInfo();
            const rightScrollBarInfo = rightScrollBar.getInfo();
            if (pageInfo.innerHeight <= windowInfo.innerHeight) {
                rightScrollBar.disappear();
            } else {
                if (!scrollPage.settings.rightScrollBarInner) {
                    rightScrollBar.show();
                }
                const sliderHeight = Math.pow(rightScrollBarInfo.innerHeight, 2) / pageInfo.innerHeight;
                rightSlider.setHeight(sliderHeight);
            }
        } else {
            rightScrollBar.disappear();
        }
    })
}