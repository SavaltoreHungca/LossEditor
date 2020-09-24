import { NodeManager } from './NodeManager';
import { DocTree, Selection } from 'editor-core';
import { EventManager, Nil, DragState } from 'utils';
import { registryEvents } from './events/events';
import { Constants } from './Constants';
import { listenUserClick, listenSelectionToSetCursor } from './selection/selectionListener';
import { listenTextInput } from './textinput/listenTextInput';
import { Cursor, WhenClick } from './elements/Cursor';
import { ViewLines } from './elements/ViewLines';
import { BackLayer } from './elements/BackLayer';
import { RegionContainer } from './elements/RegionContainer';
import { Container } from './elements/Container';
import { regisStyleSheet } from './styleClassSheet';
import { Settings, SettingRecevier } from './Settings';
import { creEle } from './elements/elementTypes';
import { CursorPositionBehavior, KeyDownBehavior, SetSelectionBehavior } from './behaviorTypes';
import { nodeCreator } from './elements/nodeTypes';



export class Editor {
    container: Container = Nil;
    cursor: Cursor = Nil;
    viewLines: ViewLines = Nil;
    backLayer: BackLayer = Nil;
    regionContainer: RegionContainer = Nil;

    settings: Settings = new Settings();
    eventManager = new EventManager();
    setCursorPositionBehaviorSet = new Map<string, CursorPositionBehavior>();
    setSelectionWhenClickBehaviorSet = new Map<string, SetSelectionBehavior>();
    keyDownBehaviorSet = new Map<string, KeyDownBehavior>();
    docTree: DocTree = new DocTree(nodeCreator);
    uiMap: NodeManager;
    tmpSelection: Selection = Nil;
    whenClick: WhenClick = Nil;

    constructor(settings: SettingRecevier) {
        for (const name in settings) this.settings[name] = settings[name];

        this.uiMap = new NodeManager(this);

        creEle(this, 'scroll-frame', this.settings.container);
        

        regisStyleSheet(this);
        registryEvents(this);

        this.eventManager.triggleEvent(Constants.events.CONTAINER_SETED);
        this.eventManager.triggleEvent(Constants.events.DOC_TREE_CREATED);

        listenUserClick(this);
        listenSelectionToSetCursor(this);
        listenTextInput(this);

        this.docTree.addEventListener('selection_change', sele => {
            console.log(sele);
        })

        this.render(this.settings.document);
    }

    render(document: any) {
        this.docTree.buildTree(document);

        this.eventManager.triggleEvent(Constants.events.DOC_TREE_ROOT_SETED);
        this.viewLines.innerHTML = '';
        this.docTree.render();
    }

    regisSetCursorPositionBehavior(nodeType: string, behavior: CursorPositionBehavior) {
        this.setCursorPositionBehaviorSet.set(nodeType, behavior);
    }

    regisSetSelectionWhenClickBehaviorSet(nodeType: string, behavior: SetSelectionBehavior){
        this.setSelectionWhenClickBehaviorSet.set(nodeType, behavior);
    }

    regisKeyDownBehavior(nodeType: string, behavior: KeyDownBehavior) {
        this.keyDownBehaviorSet.set(nodeType, behavior);
    }
}