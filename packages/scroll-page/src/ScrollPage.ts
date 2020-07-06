import { EventManager, DataListener } from 'event-driven';
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
import { Settings, SettingReceiver } from './Settings';
import Content from './Content';
import { registryEvents } from './events';
import { registryListeners } from './listeners';
import { Utils } from 'utils';

export class ScrollPage {
    eventManager: EventManager;
    dataListener: DataListener;
    settings: Settings = new Settings();
    elements: {
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

    constructor(content: HTMLElement, settings?: SettingReceiver) {
        if (settings) {
            for (let k in settings)
                this.settings[k] = settings[k];
        }

        this.eventManager = new EventManager();
        this.dataListener = new DataListener(200);


        this.elements = {
            container: new Container(document.createElement('div'), this),
            window: new Window(document.createElement('div'), this),
            page: new Page(document.createElement('div'), this),
            buttomScrollBar: new ButtomScrollBar(document.createElement('div'), this),
            rightScrollBar: new RightScrollBar(document.createElement('div'), this),
            topshallow: new TopShallow(document.createElement('div'), this),
            rightshallow: new RightShallow(document.createElement('div'), this),
            buttomSlider: new ButtomSlider(document.createElement('div'), this),
            rightSlider: new RightSlider(document.createElement('div'), this),
            content: new Content(content, this),
        }

        registryEvents(this);
        registryListeners(this);

        if (content.parentElement) {
            const parent = content.parentElement;
            const { container } = this.elements;
            parent.insertBefore(container.getNative(), content);
            parent.removeChild(content);
        }
        this.eventManager.triggleEvent(Constants.events.ELEMENTS_CREATED);
    }

    updateContainerSize() {
        const { container } = this.elements;
        const containerParent = container.getNative().parentElement;
        if (containerParent) {
            const containerInfo = container.getInfo();
            const parentInfo = Utils.getElementInfo(containerParent);
            container.setWidth(parentInfo.innerWidth + 'px');
            container.setHeight(parentInfo.innerHeight + 'px');
        }
    }

    updatePageSize() {
        const { content, page } = this.elements;
        const contentInfo = content.getInfo();
        page.setWidth(contentInfo.width + 'px');
        page.setHeight(contentInfo.height + 'px');
    }

    setContainerStyle(obj: Object) {
        this.elements.container.setStyle(obj);
    }

    contentWidthFollowContainer() {
        const { content, container } = this.elements;
        const containerInfo = container.getInfo();
        if(content){
            content.setWidth(containerInfo.innerWidth + 'px');
            if(containerInfo.innerWidth !== content.getInfo().width){
                throw new Error("cant't set content width follow container");
            }
        }
    }

    contentHeightFollowContainer() {
        const { content, container } = this.elements;
        const containerInfo = container.getInfo();
        if(content){
            content.setHeight(containerInfo.innerHeight + 'px');
            if(containerInfo.innerHeight !== content.getInfo().height){
                throw new Error("cant't set content height follow container");
            }
        }
    }
}