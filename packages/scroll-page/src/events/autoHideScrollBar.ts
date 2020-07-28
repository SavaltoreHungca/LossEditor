import Constants from "../Constants";
import { ScrollPage } from "../ScrollPage";
import { $$, DragState, $, extend, innerHtml } from "utils";
import { eleExt, windowExt, Window, Page, pageExt, RightScrollBar, RightSlider, ButtomScrollBar, ButtomSlider, TopShallow, RightShallow, rightScrollBarExt, rightSliderExt, buttomScrollBarExt, buttomSliderExt, topShallowExt, rightShallowExt } from "../elementTyps";
export function autoHideScrollBar(scrollPage: ScrollPage) {
    // 自动隐藏滚动条, 鼠标移动到右底两侧自动显示滚动条
    scrollPage.eventManager.registryEventDpendsOn([
        Constants.events.ASSEMBLE_ELEMENTS_FINISH
    ], () => {
        let { buttomSlider, buttomScrollBar, rightScrollBar, rightSlider, window: win, page } = scrollPage.elements;
        if (!page || !buttomSlider || !rightScrollBar || !rightSlider || !buttomScrollBar || !win) throw new Error();

        if (scrollPage.settings.bottomScrollBarInner && !scrollPage.settings.hiddenBottomScrollBar) {
            buttomScrollBar.disappear();

            // 底部滚动条自动消失
            win.addEventListener('wheel', (e: WheelEvent) => {
                if (!page || !buttomSlider || !rightScrollBar || !rightSlider || !buttomScrollBar || !win) throw new Error();

                const pageInfo = page.getInfo();
                const winInfo = win.getInfo();
                if (pageInfo.innerWidth <= winInfo.innerWidth) {
                    return;
                }
                if (Math.abs(e.deltaX) < 1) {
                    return;
                }
                buttomScrollBar.show();
                buttomScrollBar.fadeOut(scrollPage.settings.bottomScrollBarAutoFadeTime);
            })
            // 移动到底部显示底部滚动条
            window.addEventListener('mousemove', (e: MouseEvent) => {
                if (!page || !buttomSlider || !rightScrollBar || !rightSlider || !buttomScrollBar || !win) throw new Error();

                const pageInfo = page.getInfo();
                const winInfo = win.getInfo();
                if (pageInfo.innerWidth <= winInfo.innerWidth) {
                    return;
                }
                let { bottom, leaved } = $$.getMousePositionInElement(win, e);
                const buttomBarInfo = buttomScrollBar.getInfo();
                if (buttomSlider.dragging) {
                    return;
                }
                if (leaved && buttomScrollBar.visible()) {
                    buttomScrollBar.fadeOut(scrollPage.settings.bottomScrollBarAutoFadeTime);
                    return;
                }
                if (!leaved && bottom <= buttomBarInfo.height) {
                    buttomScrollBar.show();
                } else if (buttomScrollBar.visible()) {
                    buttomScrollBar.fadeOut(scrollPage.settings.bottomScrollBarAutoFadeTime);
                }
            });
            // 拖动 buttomslider 结束后判断是否底部滚动条是否该自动消失
            buttomSlider.addDragEvent((e: DragState) => {
                if (!page || !buttomSlider || !rightScrollBar || !rightSlider || !buttomScrollBar || !win) throw new Error();

                let { bottom, leaved } = $$.getMousePositionInElement(win, <MouseEvent>e.event);
                const buttomBarInfo = buttomScrollBar.getInfo();
                if (e.pressed === false) {
                    if (leaved && buttomScrollBar.visible()) {
                        buttomScrollBar.fadeOut(scrollPage.settings.bottomScrollBarAutoFadeTime);
                        return;
                    }
                    if (bottom <= buttomBarInfo.height) {
                        buttomScrollBar.show();
                    } else if (buttomScrollBar.visible()) {
                        buttomScrollBar.fadeOut(scrollPage.settings.bottomScrollBarAutoFadeTime);
                    }
                }
            })
        }

        if (scrollPage.settings.rightScrollBarInner && !scrollPage.settings.hiddenRightScrollBar) {
            rightScrollBar.disappear();

            win.addDragEvent((e: WheelEvent) => {
                if (!page || !buttomSlider || !rightScrollBar || !rightSlider || !buttomScrollBar || !win) throw new Error();

                const pageInfo = page.getInfo();
                const winInfo = win.getInfo();
                if (pageInfo.innerHeight <= winInfo.innerHeight) {
                    return;
                }
                if (Math.abs(e.deltaY) < 1) {
                    return;
                }
                rightScrollBar.show();
                rightScrollBar.fadeOut(scrollPage.settings.rightScrollBarAutoFadeTime);
            })
            window.addEventListener('mousemove', (e: MouseEvent) => {
                if (!page || !buttomSlider || !rightScrollBar || !rightSlider || !buttomScrollBar || !win) throw new Error();

                const pageInfo = page.getInfo();
                const winInfo = win.getInfo();
                if (pageInfo.innerHeight <= winInfo.innerHeight) {
                    return;
                }
                let { right, leaved } = $$.getMousePositionInElement(win, e);
                const rightScrollInfo = rightScrollBar.getInfo();
                if (rightSlider.dragging) {
                    return;
                }
                if (leaved && rightScrollBar.visible()) {
                    rightScrollBar.fadeOut(scrollPage.settings.rightScrollBarAutoFadeTime);
                    return;
                }
                if (!leaved && right <= rightScrollInfo.width) {
                    rightScrollBar.show();
                } else if (rightScrollBar.visible()) {
                    rightScrollBar.fadeOut(scrollPage.settings.rightScrollBarAutoFadeTime);
                }
            });
            rightSlider.addDragEvent((e: DragState) => {
                if (!page || !buttomSlider || !rightScrollBar || !rightSlider || !buttomScrollBar || !win) throw new Error();

                let { right, leaved } = $$.getMousePositionInElement(win, <MouseEvent>e.event);
                const rightScrollBarInfo = rightScrollBar.getInfo();
                if (e.pressed === false) {
                    if (leaved && rightScrollBar.visible()) {
                        rightScrollBar.fadeOut(scrollPage.settings.rightScrollBarAutoFadeTime);
                        return;
                    }
                    if (right <= rightScrollBarInfo.width) {
                        rightScrollBar.show();
                    } else if (rightScrollBar.visible()) {
                        rightScrollBar.fadeOut(scrollPage.settings.rightScrollBarAutoFadeTime);
                    }
                }
            })
        }
    })
}