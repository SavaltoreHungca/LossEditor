import { Settings, SettingReceiver } from './Settings';
import { registryEvents } from './events';
import { registryListeners } from './listeners';
import { EventManager, $$, extend } from 'utils';
import { buttomScrollBarExt, eleExt, ButtomScrollBar, Container, Page, Window, RightScrollBar, TopShallow, RightShallow, ButtomSlider, RightSlider, Content, containerExt, windowExt, pageExt, rightScrollBarExt, topShallowExt, rightShallowExt, buttomSliderExt, rightSliderExt, contentExt } from './elementTyps';
import Constants from './Constants';

declare type ElementsSet = {
    container: Container,
    window?: Window,
    page?: Page,
    buttomScrollBar?: ButtomScrollBar,
    rightScrollBar?: RightScrollBar,
    topshallow?: TopShallow,
    rightshallow?: RightShallow,
    buttomSlider?: ButtomSlider,
    rightSlider?: RightSlider,
    content?: Content,
};

export class ScrollPage {
    eventManager: EventManager;
    settings = new Settings();
    elements: ElementsSet

    constructor(content: HTMLElement, settings?: SettingReceiver) {
        if (settings) {
            for (let k in settings)
                this.settings[k] = settings[k];
        }

        this.eventManager = new EventManager();

        this.elements = { container: extend(content, [eleExt(this), containerExt(this)]) }

        registryEvents(this);
        registryListeners(this);

        if (content.parentElement) {
            const parent = content.parentElement;
            const { container } = this.elements;
            parent.insertBefore(container, content);
            parent.removeChild(content);
        }
        this.eventManager.triggleEvent(Constants.events.ELEMENTS_CREATED);
    }

    updateContainerSize() {
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
        if(!content || !page) throw new Error();
        const contentInfo = content.getInfo();
        page.setWidth(contentInfo.width);
        page.setHeight(contentInfo.height);
    }

    setContainerStyle(obj: Object) {
        this.elements.container.setStyle(obj);
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