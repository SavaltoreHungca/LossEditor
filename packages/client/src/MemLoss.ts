import { Constants } from './Constants';
import { registryEvents } from './events/events';
import { EventManager, Nil } from 'utils';
import { creEle } from './elements/elementTypes';
import { Container } from './elements/Container';
import { LeftSidePad } from './elements/LeftSidePad';
import { RightSidePad } from './elements/RightSidePad';
import { SettingReceiver, Settings } from './Settings';
import { NodeListPad } from './elements/NodeListPad';
import { NotePad } from './elements/NotePad';
import { regisStyleSheet } from './styleClassSheet';


export class MemLoss {
    eventManager: EventManager = new EventManager();
    
    container: Container = Nil;
    leftSidePad: LeftSidePad = Nil;
    rightSidePad: RightSidePad = Nil;

    nodeListPad: NodeListPad = Nil;
    notePad: NotePad = Nil;

    settings = new Settings();

    constructor(settings: SettingReceiver) {
        if (settings) for (let k in settings) this.settings[k] = settings[k];
        regisStyleSheet();
        registryEvents(this);
        this.container = creEle(this, 'container', this.settings.container);

        this.eventManager.triggleEvent(Constants.events.UI_INITIALIZED);
    }
}