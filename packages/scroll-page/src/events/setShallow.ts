import Constants from "../Constants";
import { ScrollPage } from "../ScrollPage";
import { $$, DragState, $, extend, innerHtml } from "utils";
import { eleExt, windowExt, Window, Page, pageExt, RightScrollBar, RightSlider, ButtomScrollBar, ButtomSlider, TopShallow, RightShallow, rightScrollBarExt, rightSliderExt, buttomScrollBarExt, buttomSliderExt, topShallowExt, rightShallowExt } from "../elementTyps";

export function setShallow(scrollPage: ScrollPage) {
    // 阴影条是否显示
    scrollPage.eventManager.registryEventDpendsOn([
        Constants.events.PAGE_LEFT_CHANGE,
        Constants.events.PAGE_TOP_CHANGE,
        Constants.events.WINDOW_WIDTH_CHANGE,
        Constants.events.WINDOW_HEIGHT_CHANGE,
        Constants.events.PAGE_HEIGHT_CHANGE,
        Constants.events.PAGE_WIDTH_CHANGE
    ], () => {
        let { page, topshallow, rightshallow, window } = scrollPage.elements;
        if (!page || !topshallow || !rightshallow || !window) throw new Error();

        const pageInfo = page.getInfo();
        const windowInfo = window.getInfo();

        if (scrollPage.settings.showTopShallow) {
            if (pageInfo.innerHeight <= windowInfo.innerHeight || pageInfo.top === 0) {
                topshallow.disappear();
            } else {
                topshallow.show();
            }
        } else {
            topshallow.disappear();
        }

        if (scrollPage.settings.showRightShallow) {
            if (
                scrollPage.settings.rightScrollBarInner &&
                pageInfo.innerWidth > windowInfo.innerWidth &&
                pageInfo.left === windowInfo.innerWidth - pageInfo.innerWidth - scrollPage.settings.rightScrollBarWidth
            ) {
                rightshallow.disappear();
            } else if (
                pageInfo.innerWidth > windowInfo.innerWidth &&
                pageInfo.left === windowInfo.innerWidth - pageInfo.innerWidth
            ) {
                rightshallow.disappear();
            } else if (pageInfo.innerWidth <= windowInfo.innerWidth) {
                rightshallow.disappear();
            } else {
                rightshallow.show();
            }
        } else {
            rightshallow.disappear();
        }
    })
}