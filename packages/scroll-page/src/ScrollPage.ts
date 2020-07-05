import { EventManager, DataListener } from 'event-driven';
import { Global } from './Element';
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

export class ScrollPage {
    eventManager: EventManager;
    dataListener: DataListener;
    settings: Settings = new Settings();
    global: Global;

    constructor(content: HTMLElement, settings?: SettingReceiver) {
        if (settings) {
            let st = new Settings();
            for(let index in settings){
                st[index] = settings[index];
            }
            this.settings = st;
        };
        this.eventManager = new EventManager();
        this.dataListener = new DataListener(200);
        this.global = new Global(this.eventManager, this.settings);
        registryEvents(this);
        registryListeners(this);
        this.buildElements(content);
    }

    // 构建html结构
    private buildElements = (content: HTMLElement) => {
        this.global.set("container", new Container(document.createElement('div'), this.global));
        this.global.set("window", new Window(document.createElement('div'), this.global));
        this.global.set("page", new Page(document.createElement('div'), this.global));
        this.global.set("buttomScrollBar", new ButtomScrollBar(document.createElement('div'), this.global));
        this.global.set("rightScrollBar", new RightScrollBar(document.createElement('div'), this.global));
        this.global.set("topshallow", new TopShallow(document.createElement('div'), this.global));
        this.global.set("rightshallow", new RightShallow(document.createElement('div'), this.global));
        this.global.set("buttomSlider", new ButtomSlider(document.createElement('div'), this.global));
        this.global.set("rightSlider", new RightSlider(document.createElement('div'), this.global));
        this.global.set("content", new Content(content, this.global));

        if(content.parentElement){
            const parent = content.parentElement;
            const {container} = this.global.getAll();
            parent.insertBefore(container.getNative(), content);
            parent.removeChild(content);
        }

        this.eventManager.triggleEvent(Constants.events.ELEMENTS_CREATED);
    }
}