import Constants from "./Constants";
import { ScrollPage } from "./ScrollPage";
import { $$, DragState, $, extend } from "utils";
import { eleExt, windowExt, Window, Page, pageExt, RightScrollBar, RightSlider, ButtomScrollBar, ButtomSlider, TopShallow, RightShallow, rightScrollBarExt, rightSliderExt, buttomScrollBarExt, buttomSliderExt, topShallowExt, rightShallowExt} from "./elementTyps";

export function registryEvents(scrollPage: ScrollPage) {
    assembleElementsAndInitializeUi(scrollPage);
    traceContainerSizeChange(scrollPage);
    setScrollBar(scrollPage);
    autoHideScrollBar(scrollPage);
    setShallow(scrollPage);
}


function assembleElementsAndInitializeUi(sp: ScrollPage) {
    // 组装元素事件
    // 初始化样式, 位置, 尺寸
    sp.eventManager.registryEventDpendsOn([Constants.events.ELEMENTS_CREATED],
        () => {
            const { container, content } = sp.elements;
            const idset = {
                window: $$.randmonId(),
                page: $$.randmonId(),
                rightScrollBar: $$.randmonId(),
                rightSlider: $$.randmonId(),
                buttomScrollBar: $$.randmonId(),
                buttomSlider: $$.randmonId(),
                topshallow: $$.randmonId(),
                rightshallow: $$.randmonId(),
            }
            container.setStyle({
                position: 'relative',
                overflow: 'hidden',
                width: sp.settings.containerWidth,
                height: sp.settings.containerHeight,
            })

            container.innerHTML = `
                <div data-scrollpage-type="window" id="${idset.window}" style="overflow: hidden">
                    <div data-scrollpage-type="page" id="${idset.page}" style="contain: strict; overflow: hidden">

                    </div>
                </div>
                <div data-scrollpage-type="rightScrollBar" id="${idset.rightScrollBar}" style="z-index: 100">
                    <div data-scrollpage-type="rightSlider" id="${idset.rightSlider}" style="background: hsla(0,0%,39%,.4)"></div>
                </div>
                <div data-scrollpage-type="buttomScrollBar" id="${idset.buttomScrollBar}" 
                    style="z-index: 100; height: ${sp.settings.bottomScrollBarHeight}px; left: 0; bottom: 0 ">
                    <div data-scrollpage-type="buttomSlider" id="${idset.buttomSlider}" style="background: hsla(0,0%,39%,.4)"></div>
                </div>
                <div data-scrollpage-type="topshallow" id="${idset.topshallow}" style="box-shadow: #dddddd 0 6px 6px -6px inset">
                </div>
                <div data-scrollpage-type="rightshallow" id="${idset.rightshallow}" style="box-shadow: #dddddd -6px 0 6px -6px inset">
                </div>
            `

            sp.elements.window = <Window>extend($$.wrapEle('block', $(idset.window)), [eleExt(sp), windowExt(sp)]);
            sp.elements.page = <Page>extend($$.wrapEle('absolute', $(idset.page)), [eleExt(sp), pageExt(sp)]);
            sp.elements.rightScrollBar = <RightScrollBar>extend($$.wrapEle('absolute', $(idset.rightScrollBar)), [eleExt(sp), rightScrollBarExt(sp)]);
            sp.elements.rightSlider = <RightSlider>extend($$.wrapEle('absolute', $(idset.rightSlider)), [eleExt(sp), rightSliderExt(sp)]);
            sp.elements.buttomScrollBar = <ButtomScrollBar>extend($$.wrapEle('absolute', $(idset.buttomScrollBar)), [eleExt(sp), buttomScrollBarExt(sp)]);
            sp.elements.buttomSlider = <ButtomSlider>extend($$.wrapEle('absolute', $(idset.buttomSlider)), [eleExt(sp), buttomSliderExt(sp)]);
            sp.elements.topshallow = <TopShallow>extend($$.wrapEle('absolute', $(idset.topshallow)), [eleExt(sp), topShallowExt(sp)]);
            sp.elements.rightshallow = <RightShallow>extend($$.wrapEle('absolute', $(idset.rightshallow)), [eleExt(sp), rightShallowExt(sp)]);

            buttomScrollBar.setHeight(scrollPage.settings.bottomScrollBarHeight + 'px');
            buttomScrollBar.setLeft('0');
            buttomScrollBar.setBottom('0');
            buttomSlider.setHeight(scrollPage.settings.bottomScrollBarHeight + 'px')

            rightScrollBar.setRight('0');
            rightScrollBar.setTop('0');
            rightScrollBar.setWidth(scrollPage.settings.rightScrollBarWidth + 'px');
            rightSlider.setWidth(scrollPage.settings.rightScrollBarWidth + 'px');

            topshallow.setHeight('6px');
            topshallow.setLeft('0');
            topshallow.setTop('0');

            rightshallow.setWidth('6px');
            if (scrollPage.settings.rightScrollBarInner) {
                rightshallow.setRight('0');
            } else {
                rightshallow.setRight(scrollPage.settings.rightScrollBarWidth + 'px');
            }
            rightshallow.setTop('0');

            page.setLeft(0 + 'px');
            page.setTop(0 + 'px');

            scrollPage.updateContainerSize();
            scrollPage.updatePageSize();
        }, Constants.events.ASSEMBLE_ELEMENTS_FINISH)
}

function traceContainerSizeChange(scrollPage: ScrollPage) {
    // 追踪 container 尺寸变化事件
    // 设置 window buttomScrollBar rightScrollBar topshallow rightshallow 的尺寸
    scrollPage.eventManager.registryEventDpendsOn([
        Constants.events.CONTAINER_HEIGHT_CHANGE,
        Constants.events.CONTAINER_WIDTH_CHANGE
    ],
        () => {
            let {
                container,
                window,
                buttomScrollBar,
                rightScrollBar,
                topshallow,
                rightshallow
            } = scrollPage.elements;
            const containerInfo = container.getInfo();
            const { bottomScrollBarInner, bottomScrollBarHeight, rightScrollBarInner, rightScrollBarWidth, showTopShallow, showRightShallow } = scrollPage.settings;

            rightScrollBar.setHeight(containerInfo.innerHeight + 'px');
            rightshallow.setHeight(containerInfo.innerHeight + 'px');
            if (bottomScrollBarInner) {
                window.setHeight(containerInfo.innerHeight + 'px');
            } else {
                window.setHeight(containerInfo.innerHeight - bottomScrollBarHeight + 'px');
            }

            if (rightScrollBarInner) {
                window.setWidth(containerInfo.innerWidth + 'px');
            } else {
                window.setWidth(containerInfo.innerWidth - rightScrollBarWidth + 'px');
            }

            const windowInfo = window.getInfo();
            if (rightScrollBarInner) {
                buttomScrollBar.setWidth(windowInfo.innerWidth + 'px');
                topshallow.setWidth(windowInfo.innerWidth + 'px');
            } else {
                buttomScrollBar.setWidth(windowInfo.innerWidth + 'px');
                topshallow.setWidth(windowInfo.innerWidth + 'px');
            }
        }
    )
}

function setScrollBar(scrollPage: ScrollPage) {
    // 设定底部滚动条 slider 的宽度
    // 是否显示底部滚动条
    scrollPage.eventManager.registryEventDpendsOn([
        Constants.events.BUTTOMSCROLLBAR_WIDTH_CHANGE,
        Constants.events.PAGE_WIDTH_CHANGE
    ], () => {
        let {
            page,
            buttomScrollBar,
            buttomSlider,
            window
        } = scrollPage.elements;
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
                buttomSlider.setWidth(sliderWidth + 'px');
            }
        } else {
            buttomScrollBar.disappear();
        }
    })

    // 设定右部滚动条 slider 的高度
    // 是否显示右部滚动条
    scrollPage.eventManager.registryEventDpendsOn([
        Constants.events.RIGHTSCROLLBAR_WIDTH_CHANGE,
        Constants.events.PAGE_HEIGHT_CHANGE
    ], () => {
        let {
            page,
            rightScrollBar,
            rightSlider,
            window
        } = scrollPage.elements;
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
                rightSlider.setHeight(sliderHeight + 'px');
            }
        } else {
            rightScrollBar.disappear();
        }
    })
}

function autoHideScrollBar(scrollPage: ScrollPage) {
    // 自动隐藏滚动条, 鼠标移动到右底两侧自动显示滚动条
    scrollPage.eventManager.registryEventDpendsOn([
        Constants.events.ELEMENTS_CREATED
    ], () => {
        let {
            buttomSlider,
            buttomScrollBar,
            rightScrollBar,
            rightSlider,
            window: win,
            page
        } = scrollPage.elements;

        if (scrollPage.settings.bottomScrollBarInner && !scrollPage.settings.hiddenBottomScrollBar) {
            buttomScrollBar.disappear();

            // 底部滚动条自动消失
            win.addEventListener('wheel', (e: WheelEvent) => {
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
                const pageInfo = page.getInfo();
                const winInfo = win.getInfo();
                if (pageInfo.innerWidth <= winInfo.innerWidth) {
                    return;
                }
                let { bottom, leaved } = Utils.getMousePositionInElement(win.getNative(), e);
                const buttomBarInfo = buttomScrollBar.getInfo();
                if ((<ButtomSlider>buttomSlider).dragging) {
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
            buttomSlider.addEventListener('drag', (e: DragState) => {
                let { bottom, leaved } = Utils.getMousePositionInElement(win.getNative(), <MouseEvent>e.event);
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

            win.addEventListener('wheel', (e: WheelEvent) => {
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
                const pageInfo = page.getInfo();
                const winInfo = win.getInfo();
                if (pageInfo.innerHeight <= winInfo.innerHeight) {
                    return;
                }
                let { right, leaved } = Utils.getMousePositionInElement(win.getNative(), e);
                const rightScrollInfo = rightScrollBar.getInfo();
                if ((<RightSlider>rightSlider).dragging) {
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
            rightSlider.addEventListener('drag', (e: DragState) => {
                let { right, leaved } = Utils.getMousePositionInElement(win.getNative(), <MouseEvent>e.event);
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

function setShallow(scrollPage: ScrollPage) {
    // 阴影条是否显示
    scrollPage.eventManager.registryEventDpendsOn([
        Constants.events.PAGE_LEFT_CHANGE,
        Constants.events.PAGE_TOP_CHANGE,
        Constants.events.WINDOW_WIDTH_CHANGE,
        Constants.events.WINDOW_HEIGHT_CHANGE,
        Constants.events.PAGE_HEIGHT_CHANGE,
        Constants.events.PAGE_WIDTH_CHANGE
    ], () => {
        let {
            page,
            topshallow,
            rightshallow,
            window
        } = scrollPage.elements;

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