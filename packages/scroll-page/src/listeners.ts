import { Utils } from 'utils';
import { ScrollPage } from "./ScrollPage";
import Constants from "./Constants";

export function registryListeners(scrollPage: ScrollPage) {
    // 监听 context 尺寸变化
    if (scrollPage.settings.autoUpdatePageSize) {
        scrollPage.dataListener.addListener(() => {
            const { content, page } = scrollPage.elements;
            if (content) {
                const contentInfo = content.getInfo();
                const pageInfo = page.getInfo();
                if (contentInfo.width !== pageInfo.innerWidth || contentInfo.height !== pageInfo.innerHeight) {
                    return [contentInfo.width, contentInfo.height];
                }
            }
            return false;
        }, (context: any) => {
            if (context) {
                scrollPage.updatePageSize();
            }
        }, false);
    }

    // 监听 container 尺寸变化
    if (scrollPage.settings.autoUpdateContainerSize) {
        scrollPage.dataListener.addListener(() => {
            const { container } = scrollPage.elements;
            const containerParent = container.getNative().parentElement;
            if (containerParent) {
                const containerInfo = container.getInfo();
                const parentInfo = Utils.getElementInfo(containerParent);
                if (containerInfo.width !== parentInfo.innerWidth || containerInfo.height !== parentInfo.innerHeight) {
                    return containerInfo;
                }
            }
            return false
        }, (context: any) => {
            if (context) {
                scrollPage.updateContainerSize();
            }
        }, false);
    }
}