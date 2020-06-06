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

function registryEvents(scrollPage: ScrollPage) {

    // 组装元素事件
    scrollPage.eventManager.registryEventDpendsOn(
        [Constants.events.ELEMENTS_CREATED],
        Constants.events.ASSEMBLE_ELEMENTS_FINISH,
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
                'box-shadow': '#dddddd 0 6px 6px -6px inset'
            })
            rightshallow.setStyle({
                position: 'absolute',
                'box-shadow': '#dddddd -6px 0 6px -6px inset'
            })
            buttomScrollBar.setStyle({
                position: 'absolute',
                visibility: 'hidden'
            })
            buttomSlider.setStyle({
                position: 'absolute',
                background: 'hsla(0,0%,39%,.4)',
                height: '14px'
            });
            rightScrollBar.setStyle({
                position: 'absolute',
            })
            rightSlider.setStyle({
                position: 'absolute',
                background: 'hsla(0,0%,39%,.4)',
                width: '14px'
            })
        }
    )

    // 初始化元素尺寸事件和位置
    scrollPage.eventManager.registryEventDpendsOn(
        [Constants.events.ASSEMBLE_ELEMENTS_FINISH],
        Constants.events.INITIAL_ELEMENTS_SIZE_POSITION,
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

            let containerStyle = container.getCssStyle();

            if(!containerStyle.width || !containerStyle.height){
                container.setWidth('300px');
                container.setHeight('200px');
            }else{
                // 这里仅仅只是为了触发事件
                container.setWidth(containerStyle.width);
                container.setHeight(containerStyle.height);
            }

            buttomScrollBar.setHeight('14px');
            buttomScrollBar.setLeft('0');
            buttomScrollBar.setButtom('0');

            rightScrollBar.setRight('0');
            rightScrollBar.setTop('0');
            rightScrollBar.setWidth('14px');

            topshallow.setHeight('6px');
            topshallow.setLeft('0');
            topshallow.setTop('0');

            rightshallow.setWidth('6px');
            rightshallow.setRight('0');
            rightshallow.setTop('0');
        }
    )

    // 追踪 container 尺寸变化事件
    scrollPage.eventManager.registryEventDpendsOn(
        [Constants.events.ASSEMBLE_ELEMENTS_FINISH],
        Constants.events.INITIAL_ELEMENTS_SIZE_POSITION,
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
        }
    )
}


export class ScrollPage {
    eventManager: EventManager;
    global: Global;

    constructor(container: HTMLElement) {
        this.eventManager = new EventManager();
        this.global = new Global(this.eventManager);
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