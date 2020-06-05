import { EventManager } from 'event-driven';
import { Global } from 'utils';
import Container from './Container';
import Constants from './Constants';
import Window from './Window';
import Page from './Page';


export class ScrollPage{
    private eventManager: EventManager = new EventManager();
    private global: Global = new Global();

    constructor(container: HTMLElement){
        this.buildStructure(container);
        console.log("shit");
    }

    // 构建html结构
    private buildStructure = (container: HTMLElement)=>{
        this.global.set("container", new Container(container, this.global));
        this.eventManager.triggleEvent(Constants.events.CONTAINER_DOM_CREATED);

        this.global.set("window", new Window(container, this.global));
        this.eventManager.triggleEvent(Constants.events.WINDOW_DOM_CREATED);

        this.global.set("page", new Page(container, this.global));
        this.eventManager.triggleEvent(Constants.events.PAGE_DOM_CREATED);
    }
}