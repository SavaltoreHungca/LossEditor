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

function registryEvents(scrollPage: ScrollPage) {

    // 组装元素事件
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
            })
            buttomSlider.setStyle({
                position: 'absolute',
                background: 'hsla(0,0%,39%,.4)'
            });
            rightScrollBar.setStyle({
                position: 'absolute',
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
            rightshallow.setRight(scrollPage.settings.rightScrollBarWidth + 'px');
            rightshallow.setTop('0');

            page.setWidth(1000 + 'px');
            page.setHeight(1000 + 'px');
        },
        Constants.events.ASSEMBLE_ELEMENTS_FINISH
    )

    // 追踪 container 尺寸变化事件
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
                buttomScrollBar.setWidth(windowInfo.innerWidth - rightScrollBarWidth + 'px');
                topshallow.setWidth(windowInfo.innerWidth - rightScrollBarWidth + 'px');
            } else {
                buttomScrollBar.setWidth(windowInfo.innerWidth + 'px');
                topshallow.setWidth(windowInfo.innerWidth + 'px');
            }
        }
    )

    // 设定底部滚动条 slider 的宽度
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
            } = scrollPage.global.getAll();
            const { bottomScrollBarInner, bottomScrollBarHeight, rightScrollBarInner, rightScrollBarWidth, showTopShallow, showRightShallow } = scrollPage.global.settings;


            const pageInfo = page.getInfo();
            const buttomScrollBarInfo = buttomScrollBar.getInfo();
            if (pageInfo.innerWidth <= buttomScrollBarInfo.innerWidth) {
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
    scrollPage.eventManager.registryEventDpendsOn(
        [
            Constants.events.RIGHTSCROLLBAR_WIDTH_CHANGE,
            Constants.events.PAGE_HEIGHT_CHANGE
        ],
        () => {
            let {
                page,
                rightScrollBar,
                rightSlider
            } = scrollPage.global.getAll();
            const { bottomScrollBarInner, bottomScrollBarHeight, rightScrollBarInner, rightScrollBarWidth, showTopShallow, showRightShallow } = scrollPage.global.settings;

            const pageInfo = page.getInfo();
            const rightScrollBarInfo = rightScrollBar.getInfo();
            if (pageInfo.innerHeight <= rightScrollBarInfo.innerHeight) {
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