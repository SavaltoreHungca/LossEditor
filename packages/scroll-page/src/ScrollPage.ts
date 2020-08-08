import { Settings, SettingReceiver } from './Settings';
import { registryEvents } from './events/events';
import { EventManager, $$, extend, Nil } from 'utils';
import { creEle } from './elements/elementTyps';
import { ButtomScrollBar } from './elements/ButtomScrollBar';
import { Container } from './elements/Container';
import { Page } from './elements/Page';
import { Window } from './elements/Window';
import { RightScrollBar } from './elements/RightScrollBar';
import { TopShallow } from './elements/TopShallow';
import { RightShallow } from './elements/RightShallow';
import { ButtomSlider } from './elements/ButtomSlider';
import { RightSlider } from './elements/RightSlider';
import { Content } from './elements/Content';
import Constants from './Constants';
import { regisStyleSheet } from './styleClassSheet';
import { scrollShow } from './scrollShow';

declare type ElementsSet = {
    container: Container,
    window: Window,
    page: Page,
    buttomScrollBar: ButtomScrollBar,
    rightScrollBar: RightScrollBar,
    topshallow: TopShallow,
    rightshallow: RightShallow,
    buttomSlider: ButtomSlider,
    rightSlider: RightSlider,
    content: Content,
};

export class ScrollPage {
    eventManager: EventManager;
    settings = new Settings();
    elements: ElementsSet

    constructor(content: HTMLElement, settings?: SettingReceiver) {
        if (settings) for (let k in settings) this.settings[k] = settings[k];

        this.eventManager = new EventManager();

        this.elements = {
            container: creEle(this, 'container'),
            content: creEle(this, 'content', content),
            window: Nil,
            page: Nil,
            buttomScrollBar: Nil,
            rightScrollBar: Nil,
            topshallow: Nil,
            rightshallow: Nil,
            buttomSlider: Nil,
            rightSlider: Nil,
        }

        regisStyleSheet(this);
        registryEvents(this);
        // registryListeners(this);

        if (content.parentElement) {
            const parent = content.parentElement;
            const { container } = this.elements;
            parent.insertBefore(container, content);
            parent.removeChild(content);
        }
        this.eventManager.triggleEvent(Constants.events.ELEMENTS_CREATED);
    }

    containerSizeFollowOuter() {
        const { container } = this.elements;
        const containerParent = container.parentElement;
        if (containerParent) {
            const containerInfo = container.getInfo();
            const parentInfo = $$.getElementInfo(containerParent);
            container.setWidth(parentInfo.innerWidth);
            container.setHeight(parentInfo.innerHeight);
        }
    }

    updatePageSize() {
        const { content, page } = this.elements;
        const contentInfo = content.getInfo();
        page.setWidth(contentInfo.width);
        page.setHeight(contentInfo.height);
    }

    setContainerSize(size: { width?: number | string, height?: number | string }) {
        if (size.width) this.elements.container.setWidth(size.width);
        if (size.height) this.elements.container.setHeight(size.height);
    }

    contentWidthFollowContainer() {
        const { content, container } = this.elements;
        const containerInfo = container.getInfo();
        if (content) {
            content.setWidth(containerInfo.innerWidth);
            if (containerInfo.innerWidth !== content.getInfo().width) {
                throw new Error("cant't set content width follow container");
            }
        }
    }

    scrollShow(ele: HTMLElement) {
        scrollShow(ele, this);
    }

    contentHeightFollowContainer() {
        const { content, container } = this.elements;
        const containerInfo = container.getInfo();
        if (content) {
            content.setHeight(containerInfo.innerHeight + 'px');
            if (containerInfo.innerHeight !== content.getInfo().height) {
                throw new Error("cant't set content height follow container");
            }
        }
    }
}