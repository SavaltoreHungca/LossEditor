import { Utils } from 'utils';
import { ScrollPage } from "./ScrollPage";
import Constants from "./Constants";

export function registryListeners(scrollPage: ScrollPage) {
    // 监听 context 尺寸变化
    if (scrollPage.settings.autoUpdatePageSize) {
        scrollPage.dataListener.addLoop(() => {
            const { content, page } = scrollPage.elements;
            if (content) {
                const contentInfo = content.getInfo();
                const pageInfo = page.getInfo();
                if (contentInfo.width !== pageInfo.innerWidth || contentInfo.height !== pageInfo.innerHeight) {
                    scrollPage.updatePageSize();
                }
            }
        });
    }

    // 监听 container 尺寸变化
    if (scrollPage.settings.autoUpdateContainerSize) {
        scrollPage.dataListener.addLoop(() => {
            const { container } = scrollPage.elements;
            const containerParent = container.getNative().parentElement;
            if (containerParent) {
                const containerInfo = container.getInfo();
                const parentInfo = Utils.getElementInfo(containerParent);
                if (containerInfo.width !== parentInfo.innerWidth || containerInfo.height !== parentInfo.innerHeight) {
                    scrollPage.updateContainerSize();
                }
            }
        });
    }

    // content 宽度随 container 变化
    if (scrollPage.settings.contentFollowContainerWidth) {
        scrollPage.dataListener.addLoop(() => {
            const { container, content } = scrollPage.elements;
            if (content) {
                const containerInfo = container.getInfo();
                if (containerInfo.innerWidth !== content.getInfo().width) {
                    scrollPage.contentWidthFollowContainer();
                }
            }
        });
    }

    // content 高度随 container 变化
    if (scrollPage.settings.contentFollowContainerHeight) {
        scrollPage.dataListener.addLoop(() => {
            const { container, content } = scrollPage.elements;
            if (content) {
                const containerInfo = container.getInfo();
                if (containerInfo.innerHeight !== content.getInfo().height) {
                    scrollPage.contentHeightFollowContainer();
                }
            }
        });
    }
}