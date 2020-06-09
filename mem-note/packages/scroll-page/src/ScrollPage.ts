import { Utils } from 'utils';
import { EventManager } from 'event-driven';
import { Global } from './other/Element';
import Container from './Container';
import Constants from './Constants';
import Window from './Window';
import Page from './Page';
import TopShallow from './TopShallow';
import RightShallow from './RightShallow';
import ButtomScrollBar from './ButtomScrollBar';
import RightScrollBar from './RightScrollBar';
import ButtomSlider from './ButtomSlider';
import RightSlider from './RightSlider';
import { Settings } from './Settings';
import { DragState } from 'utils';

function registryEvents(scrollPage: ScrollPage) {

    // 组装元素事件
    // 初始化样式, 位置, 尺寸
    scrollPage.eventManager.registryEventDpendsOn(
        [Constants.events.ELEMENTS_CREATED],
        () => {
            let {
                container,
                window,
                page,
                buttomScrollBar,
                rightScrollBar,
                topshallow,
                rightshallow,
                buttomSlider,
                rightSlider
            } = scrollPage.global.getAll();

            container.append(window);
            window.append(page);
            container.append(rightScrollBar);
            container.append(buttomScrollBar);
            container.append(topshallow);
            container.append(rightshallow);
            buttomScrollBar.append(buttomSlider);
            rightScrollBar.append(rightSlider);

            container.setStyle({
                position: 'relative',
                border: '1px solid #eee',
                overflow: 'hidden'
            })
            window.setStyle({
                position: 'relative',
                overflow: 'hidden'
            })
            topshallow.setStyle({
                position: 'absolute',
                'box-shadow': '#dddddd 0 6px 6px -6px inset',
            })
            rightshallow.setStyle({
                position: 'absolute',
                'box-shadow': '#dddddd -6px 0 6px -6px inset'
            })
            buttomScrollBar.setStyle({
                position: 'absolute',
                'z-index': '9999'
            })
            buttomSlider.setStyle({
                position: 'absolute',
                background: 'hsla(0,0%,39%,.4)'
            });
            rightScrollBar.setStyle({
                position: 'absolute',
                'z-index': '9999'
            })
            rightSlider.setStyle({
                position: 'absolute',
                background: 'hsla(0,0%,39%,.4)',
            })
            page.setStyle({
                position: 'absolute',
                contain: 'strict',
                overflow: 'hidden'
            })

            let containerStyle = container.getCssStyle();
            if (!containerStyle.width || !containerStyle.height) {
                container.setWidth('300px');
                container.setHeight('200px');
            } else {
                // 这里仅仅只是为了触发事件
                container.setWidth(containerStyle.width);
                container.setHeight(containerStyle.height);
            }
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

            page.setWidth(1000 + 'px');
            page.setHeight(1000 + 'px');
            page.setLeft(0 + 'px');
            page.setTop(0 + 'px');
        },
        Constants.events.ASSEMBLE_ELEMENTS_FINISH
    )

    // 追踪 container 尺寸变化事件
    // 设置 window buttomScrollBar rightScrollBar topshallow rightshallow 的尺寸
    scrollPage.eventManager.registryEventDpendsOn(
        [
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
            } = scrollPage.global.getAll();
            const containerInfo = container.getInfo();
            const { bottomScrollBarInner, bottomScrollBarHeight, rightScrollBarInner, rightScrollBarWidth, showTopShallow, showRightShallow } = scrollPage.global.settings;

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

    // 设定底部滚动条 slider 的宽度
    // 是否显示底部滚动条
    scrollPage.eventManager.registryEventDpendsOn(
        [
            Constants.events.BUTTOMSCROLLBAR_WIDTH_CHANGE,
            Constants.events.PAGE_WIDTH_CHANGE
        ],
        () => {
            let {
                page,
                buttomScrollBar,
                buttomSlider,
                window
            } = scrollPage.global.getAll();
            const { bottomScrollBarInner, bottomScrollBarHeight, rightScrollBarInner, rightScrollBarWidth, showTopShallow, showRightShallow } = scrollPage.global.settings;


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
        }
    )

    // 设定右部滚动条 slider 的高度
    // 是否显示右部滚动条
    scrollPage.eventManager.registryEventDpendsOn(
        [
            Constants.events.RIGHTSCROLLBAR_WIDTH_CHANGE,
            Constants.events.PAGE_HEIGHT_CHANGE
        ],
        () => {
            let {
                page,
                rightScrollBar,
                rightSlider,
                window
            } = scrollPage.global.getAll();
            const { bottomScrollBarInner, bottomScrollBarHeight, rightScrollBarInner, rightScrollBarWidth, showTopShallow, showRightShallow } = scrollPage.global.settings;

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
        }
    )

    // 阴影条是否显示
    scrollPage.eventManager.registryEventDpendsOn(
        [
            Constants.events.PAGE_LEFT_CHANGE,
            Constants.events.PAGE_TOP_CHANGE,
            Constants.events.WINDOW_WIDTH_CHANGE,
            Constants.events.WINDOW_HEIGHT_CHANGE,
            Constants.events.PAGE_HEIGHT_CHANGE,
            Constants.events.PAGE_WIDTH_CHANGE
        ],
        () => {
            let {
                page,
                rightScrollBar,
                rightSlider,
                topshallow,
                rightshallow,
                window
            } = scrollPage.global.getAll();
            const { bottomScrollBarInner, bottomScrollBarHeight, rightScrollBarInner, rightScrollBarWidth, showTopShallow, showRightShallow } = scrollPage.global.settings;

            const pageInfo = page.getInfo();
            const windowInfo = window.getInfo();

            if (
                pageInfo.top === 0 &&
                pageInfo.innerHeight > windowInfo.innerHeight
            ) {
                topshallow.disappear();
            } else {
                topshallow.show();
            }

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
            } else {
                rightshallow.show();
            }
        }
    )

    // 自动隐藏滚动条
    scrollPage.eventManager.registryEventDpendsOn(
        [
            Constants.events.ELEMENTS_CREATED
        ],
        () => {
            let {
                buttomSlider,
                buttomScrollBar,
                window: win
            } = scrollPage.global.getAll();

            if (scrollPage.settings.bottomScrollBarInner) {
                buttomScrollBar.disappear();

                // 底部滚动条自动消失
                win.addEventListener('wheel', (e: WheelEvent) => {
                    if (Math.abs(e.deltaX) < 1) {
                        return;
                    }
                    buttomScrollBar.show();
                    buttomScrollBar.fadeOut();
                })
                // 移动到底部显示底部滚动条
                window.addEventListener('mousemove', (e: MouseEvent) => {
                    let { bottom, leaved } = Utils.getMousePositionInElement(win.getNative(), e);
                    const buttomBarInfo = buttomScrollBar.getInfo();
                    if((<ButtomSlider>buttomSlider).dragging){
                        return;
                    }
                    if(leaved){
                        buttomScrollBar.fadeOut();
                        return;
                    }
                    if (bottom <= buttomBarInfo.height) {
                        buttomScrollBar.show();
                    } else {
                        buttomScrollBar.fadeOut();
                    }
                });
                // 拖动 buttomslider 结束后判断是否底部滚动条是否该自动消失
                buttomSlider.addEventListener('drag', (e: DragState)=>{
                    let { bottom, leaved } = Utils.getMousePositionInElement(win.getNative(), <MouseEvent>e.event);
                    const buttomBarInfo = buttomScrollBar.getInfo();
                    if(e.pressed === false){
                        if(leaved){
                            buttomScrollBar.fadeOut();
                            return;
                        }
                        if (bottom <= buttomBarInfo.height) {
                            buttomScrollBar.show();
                        } else {
                            buttomScrollBar.fadeOut();
                        }
                    }  
                })
                
            }
        }
    )
}


export class ScrollPage {
    eventManager: EventManager;
    settings: Settings = new Settings();
    global: Global;

    constructor(container: HTMLElement, settings?: Settings) {
        if (settings) this.settings = settings;
        this.eventManager = new EventManager();
        this.global = new Global(this.eventManager, this.settings);
        registryEvents(this);
        this.buildElements(container);
    }

    // 构建html结构
    private buildElements = (container: HTMLElement) => {
        this.global.set("container", new Container(container, this.global));
        this.global.set("window", new Window(document.createElement('div'), this.global));
        this.global.set("page", new Page(document.createElement('div'), this.global));
        this.global.set("buttomScrollBar", new ButtomScrollBar(document.createElement('div'), this.global));
        this.global.set("rightScrollBar", new RightScrollBar(document.createElement('div'), this.global));
        this.global.set("topshallow", new TopShallow(document.createElement('div'), this.global));
        this.global.set("rightshallow", new RightShallow(document.createElement('div'), this.global));
        this.global.set("buttomSlider", new ButtomSlider(document.createElement('div'), this.global));
        this.global.set("rightSlider", new RightSlider(document.createElement('div'), this.global));

        this.eventManager.triggleEvent(Constants.events.ELEMENTS_CREATED);
    }
}