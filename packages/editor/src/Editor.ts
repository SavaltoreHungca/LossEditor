import { NodeManager } from './NodeManager';
import { DocTree, DocTreeResolver } from 'editor-core';
import { EventManager, Nil } from 'utils';
import { listenSelectionToSetCursor } from './selection/listenSelectionToSetCursor';
import { registryEvents } from './events/events';
import { Constants } from './Constants';
import { listenUserChangeSelection } from './selection/selectionListener';
import { listenTextInput } from './textinput/listenTextInput';
import { Cursor } from './elements/Cursor';
import { ViewLines } from './elements/ViewLines';
import { BackLayer } from './elements/BackLayer';
import { RegionContainer } from './elements/RegionContainer';
import { Container } from './elements/Container';
import { regisStyleSheet } from './styleClassSheet';
import { Settings, SettingRecevier } from './Settings';
import { creEle } from './elements/elementTypes';
import { CursorPositionBehavior, KeyDownBehavior } from './behaviorTypes';



export class Editor {
    container: Container;
    cursor: Cursor = Nil;
    viewLines: ViewLines = Nil;
    backLayer: BackLayer = Nil;
    regionContainer: RegionContainer = Nil;

    settings: Settings = new Settings();
    eventManager = new EventManager();
    setCursorPositionBehaviorSet = new Map<string, CursorPositionBehavior>();
    keyDownBehaviorSet = new Map<string, KeyDownBehavior>();
    docTree: DocTree = new DocTree();
    uiMap: NodeManager;

    constructor(settings: SettingRecevier) {
        for (const name in settings) this.settings[name] = settings[name];

        this.container = creEle(this, 'container', this.settings.container);
        this.uiMap = new NodeManager(this);

        regisStyleSheet(this);
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

        this.render(this.settings.document);
    }

    render(document: any) {
        if (!this.viewLines) throw new Error();

        this.docTree.setRoot(DocTreeResolver.fromObj(document));
        this.eventManager.triggleEvent(Constants.events.DOC_TREE_ROOT_SETED);
        this.viewLines.innerHTML = '';
        this.docTree.render();
    }

    updateSize() {
        // const containerInfo = Utils.getElementInfo(this.container);
        // Utils.setStyle(this.viewLines, { width: containerInfo.innerWidth });
        // this.render(this.data);
    }

    regisSetCursorPositionBehavior(nodeType: string, behavior: CursorPositionBehavior) {
        this.setCursorPositionBehaviorSet.set(nodeType, behavior);
    }

    regisKeyDownBehavior(nodeType: string, behavior: KeyDownBehavior){
        this.keyDownBehaviorSet.set(nodeType, behavior);
    }
}