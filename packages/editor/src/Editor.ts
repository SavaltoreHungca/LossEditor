import { data } from './testdata';
import { DocTree, DocTreeResolver, Node } from 'editor-core';
import { EventManager, DataListener } from 'event-driven';
import { Utils, BidMap } from 'utils';
import { createCursor, listenSelectionToSetCursor } from './selection/cursor';
import { createElement } from './utils';
import { listenContainerSizeChange } from './autoResize';
import { listenSelectionChangeToSetSelectedRegion } from './renderSelectedRegion';
import { listenTextInput } from './textInput';
import { listenUserPressKey } from './keyboard';
import { registryEvents } from './events';
import { Constants } from './Constants';
import { listenUserChangeSelection } from './selection/selectionListener';


export type SetCursorPositionResult = {
    left: number,
    top: number,
    height: number,
}

export class Editor {
    cursor: HTMLTextAreaElement;
    container: HTMLElement;
    viewLines: HTMLElement = createElement('view-lines');
    backLayer: HTMLElement = createElement('back-layer');
    regionContainer: HTMLElement = document.createElement('div');
    eventManager: EventManager = new EventManager();
    dataListener: DataListener = new DataListener(200);
    inputText: string = '';

    setCursorPositionBehaviorSet = new Map<string, Function>();
    docTree: DocTree = new DocTree();
    uiMap = new BidMap<Node, HTMLElement>();

    constructor(container: HTMLElement) {
        this.container = container;
        this.cursor = createCursor(this);
        registryEvents(this);
        this.eventManager.triggleEvent(Constants.events.ELEMENTS_CREATED);
        this.eventManager.triggleEvent(Constants.events.DOC_TREE_CREATED);

        this.__init__();

        this.docTree.addEventListener('selection_change', sele => {
            console.log(sele);
        })
    }

    render() {
        this.docTree.setRoot(DocTreeResolver.fromObj(data));
        this.eventManager.triggleEvent(Constants.events.DOC_TREE_ROOT_SETED);
        this.viewLines.innerHTML = '';
        this.docTree.render();
    }

    updateSize() {
        // const containerInfo = Utils.getElementInfo(this.container);
        // Utils.setStyle(this.viewLines, { width: containerInfo.innerWidth });
        // this.render(this.data);
    }

    regisSetCursorPositionBehavior(nodeType: string, behavior: (element: HTMLElement, offset: number, editor: Editor) => SetCursorPositionResult | undefined) {
        this.setCursorPositionBehaviorSet.set(nodeType, behavior);
    }

    private __init__() {
        listenUserChangeSelection(this);
        listenSelectionToSetCursor(this);
        // listenContainerSizeChange(this);
        // listenSelectionChangeToSetSelectedRegion(this);
        // listenTextInput(this);
        // listenUserPressKey(this);
    }

}