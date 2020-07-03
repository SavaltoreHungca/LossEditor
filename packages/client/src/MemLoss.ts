import { Constants } from './Constants';
import { EventManager } from 'event-driven';
import { Global } from './other/Element';
import { Container } from './Container';
import { SidePad } from './SidePad';
import { EditorFrame } from './EditorFrame';
import { registryEvents } from './registryEvents';
import { SidePadResizingBar } from './SidePadResizingBar';



export class MemLoss {
    eventManager: EventManager = new EventManager();
    global: Global = new Global(this.eventManager);

    constructor(container: HTMLElement){
        registryEvents(this);
        this.buildElements(container);
    }

    buildElements(container: HTMLElement){
        this.global.set('container', new Container(container, this.global));
        this.global.set('editorFrame', new EditorFrame(document.createElement('div'), this.global));
        this.global.set('sidePad', new SidePad(document.createElement('div'), this.global));
        this.global.set('sidePadResizingBar', new SidePadResizingBar(document.createElement('div'), this.global));

        this.eventManager.triggleEvent(Constants.events.ELEMENTS_BUILD_FINISH);
    }
}