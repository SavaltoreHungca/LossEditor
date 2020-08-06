import Constants from "../Constants";
import { ScrollPage } from "../ScrollPage";

export function traceContainerSizeChange(sp: ScrollPage) {
    // 追踪 container 尺寸变化事件
    // 设置 window buttomScrollBar rightScrollBar topshallow rightshallow 的尺寸
    sp.eventManager.bindEventOnMany([
        Constants.events.ASSEMBLE_ELEMENTS_FINISH,
        Constants.events.CONTAINER_HEIGHT_CHANGE,
        Constants.events.CONTAINER_WIDTH_CHANGE
    ], () => {
            let { container, window, buttomScrollBar, rightScrollBar, topshallow, rightshallow } = sp.elements;

            const containerInfo = container.getInfo();

            rightScrollBar.setHeight(containerInfo.innerHeight);
            rightshallow.setHeight(containerInfo.innerHeight);
            if (sp.settings.bottomScrollBarInner) {
                window.setHeight(containerInfo.innerHeight);
            } else {
                window.setHeight(containerInfo.innerHeight - sp.settings.bottomScrollBarHeight);
            }

            if (sp.settings.rightScrollBarInner) {
                window.setWidth(containerInfo.innerWidth);
            } else {
                window.setWidth(containerInfo.innerWidth - sp.settings.rightScrollBarWidth);
            }

            const windowInfo = window.getInfo();
            if (sp.settings.rightScrollBarInner) {
                buttomScrollBar.setWidth(windowInfo.innerWidth);
                topshallow.setWidth(windowInfo.innerWidth);
            } else {
                buttomScrollBar.setWidth(windowInfo.innerWidth);
                topshallow.setWidth(windowInfo.innerWidth);
            }
        }
    )
}