import { ScrollPage } from "./ScrollPage";
import Constants from "./Constants";

export function registryListeners(scrollPage: ScrollPage) {

    // 监听 context 尺寸变化
    scrollPage.dataListener.addListener(() => {
        const { content } = scrollPage.global.getAll();
        if (content) {
            const contentInfo = content.getInfo();
            return [contentInfo.width, contentInfo.height];
        } else {
            return false
        }
    }, (context: any) => {
        if (context) {
            const [width, height] = context;
            const { page } = scrollPage.global.getAll();
            page.setWidth(width + 'px');
            page.setHeight(height + 'px');
        }
    }, false);

    // 监听 container 尺寸变化
    scrollPage.dataListener.addListener(() => {
        const { container } = scrollPage.global.getAll();
        if (container) {
            const containerInfo = container.getInfo();
            return [containerInfo.width, containerInfo.height];
        } else {
            return false
        }
    }, (context: any) => {
        if (context) {
            scrollPage.eventManager.triggleEvent(Constants.events.CONTAINER_WIDTH_CHANGE);
            scrollPage.eventManager.triggleEvent(Constants.events.CONTAINER_HEIGHT_CHANGE)
        }
    }, false);

}