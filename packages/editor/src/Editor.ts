import { NodeManager } from './NodeManager';
import { data } from './testdata';
import { DocTree, DocTreeResolver, Node } from 'editor-core';
import { $$, BidMap, extend, EventManager } from 'utils';
import { listenSelectionToSetCursor } from './selection/cursor';
import { registryEvents } from './events';
import { Constants } from './Constants';
import { listenUserChangeSelection } from './selection/selectionListener';
import { listenTextInput } from './textinput/listenTextInput';
import { Cursor, ViewLines, BackLayer, RegionContainer, Container } from './elements/elementTypes';
import { uiExt } from './elements/ext/uiExt';
import { creEle } from './elements/creEle';

export type SetCursorPositionResult = {
    left: number,
    top: number,
    height: number,
}

export class Editor {
    container: Container;
    cursor?: Cursor;
    viewLines?: ViewLines;
    backLayer?: BackLayer;
    regionContainer?: RegionContainer;

    eventManager = new EventManager();
    setCursorPositionBehaviorSet = new Map<string, Function>();
    docTree: DocTree = new DocTree();
    uiMap: NodeManager;

    constructor(container: HTMLElement) {
        this.container = creEle(this, 'container', container);
        this.uiMap = new NodeManager(this);

        registryEvents(this);

        this.eventManager.triggleEvent(Constants.events.CONTAINER_SETED);
        this.eventManager.triggleEvent(Constants.events.DOC_TREE_CREATED);

        listenUserChangeSelection(this);
        listenSelectionToSetCursor(this);
        listenTextInput(this);
        // listenContainerSizeChange(this);
        // listenSelectionChangeToSetSelectedRegion(this);
        // listenTextInput(this);
        // listenUserPressKey(this);

        this.docTree.addEventListener('selection_change', sele => {
            console.log(sele);
        })
    }

    render() {
        if (!this.viewLines) throw new Error();

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
}