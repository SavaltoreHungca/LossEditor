import { EventManager, DataListener } from 'event-driven';
import { Utils } from 'utils';
import { render } from './render';
import { createCursor, listenSelectionToSetCursor } from './cursor';
import { createElement } from './utils';
import { listenUserChangeSelection, Selection } from './Selection';
import { listenContainerSizeChange } from './autoResize';
import { listenSelectionChangeToSetSelectedRegion } from './renderSelectedRegion';
import { listenTextInput } from './textInput';
import { listenUserPressKey } from './keyboard';
import { registryEvents } from './events';
import { Constants } from './Constants';


export class Editor {
    cursor: HTMLTextAreaElement;
    container: HTMLElement;
    viewLines: HTMLElement = createElement('view-lines');
    backLayer: HTMLElement = createElement('back-layer');
    regionContainer: HTMLElement = document.createElement('div');
    eventManager: EventManager = new EventManager();
    dataListener: DataListener = new DataListener(200);
    selection: Selection | undefined;
    data: any;
    inputText: string = '';

    constructor(container: HTMLElement) {
        this.container = container;
        this.cursor = createCursor(this);
        registryEvents(this);
        this.eventManager.triggleEvent(Constants.events.ELEMENTS_CREATED);
        this.__init__();
    }

    render(data?: any) {
        if (!data) this.data = [
            {
                type: 'paragraph',
                indentation: 0,
                placeholder: {
                    content: 'this is just a placeholder, you can do your best to make this line so long !!!!!!'
                },
                content: ''
            }
        ]
        else this.data = data;
        render(this.data, this.viewLines);
    }

    updateSize() {
        const containerInfo = Utils.getElementInfo(this.container);
        Utils.setStyle(this.viewLines, { width: containerInfo.innerWidth });
        this.render(this.data);
    }

    private __init__() {
        listenUserChangeSelection(this);
        listenSelectionToSetCursor(this);
        listenContainerSizeChange(this);
        listenSelectionChangeToSetSelectedRegion(this);
        listenTextInput(this);
        listenUserPressKey(this);
    }

}