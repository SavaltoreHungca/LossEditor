import { Constants } from './Constants';
import { registryEvents } from './events/events';
import { EventManager, Nil } from 'utils';
import { creEle } from './elements/elementTypes';
import { Container } from './elements/Container';
import { LeftSidePad } from './elements/LeftSidePad';
import { RightSidePad } from './elements/RightSidePad';


export class MemLoss {
    eventManager: EventManager = new EventManager();
    
    container: Container = Nil;
    leftSidePad: LeftSidePad = Nil;
    rightSidePad: RightSidePad = Nil;

    constructor(container: HTMLElement) {
        registryEvents(this);
        this.container = creEle(this, 'container', container);
    }
}