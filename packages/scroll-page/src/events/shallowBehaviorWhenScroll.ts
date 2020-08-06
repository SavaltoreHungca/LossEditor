import Constants from "../Constants";
import { ScrollPage } from "../ScrollPage";

export function shallowBehaviorWhenScroll(scrollPage: ScrollPage) {
    // 阴影条是否显示
    scrollPage.eventManager.bindEventOnMany([
        Constants.events.ASSEMBLE_ELEMENTS_FINISH,
        Constants.events.PAGE_LEFT_CHANGE,
        Constants.events.PAGE_TOP_CHANGE,
    ], () => {
        let { page, topshallow, rightshallow, window } = scrollPage.elements;

        const pageInfo = page.getInfo();
        const windowInfo = window.getInfo();

        if (scrollPage.settings.showTopShallow) {
            if (pageInfo.innerHeight <= windowInfo.innerHeight || pageInfo.top === 0) {
                topshallow.disappear();
            } else {
                topshallow.show();
            }
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
        }
    })
}