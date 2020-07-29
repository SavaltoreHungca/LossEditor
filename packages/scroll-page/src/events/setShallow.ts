import Constants from "../Constants";
import { ScrollPage } from "../ScrollPage";

export function setShallow(scrollPage: ScrollPage) {
    // 阴影条是否显示
    scrollPage.eventManager.bindEventOnMany([
        Constants.events.ASSEMBLE_ELEMENTS_FINISH,
        Constants.events.WINDOW_WIDTH_CHANGE,
        Constants.events.WINDOW_HEIGHT_CHANGE,
        Constants.events.PAGE_HEIGHT_CHANGE,
        Constants.events.PAGE_WIDTH_CHANGE
    ], () => {
        let { page, topshallow, rightshallow, window } = scrollPage.elements;
        if (!page || !topshallow || !rightshallow || !window) throw new Error();

        if (!scrollPage.settings.showTopShallow) {
            topshallow.disappear();
        }

        if (!scrollPage.settings.showRightShallow) {
            rightshallow.disappear();
        }
    })
}