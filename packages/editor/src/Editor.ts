import { NodeManager } from './NodeManager';
import { DocTree, Selection } from 'editor-core';
import { EventManager, Nil, DragState, MapObj } from 'utils';
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
import { nodeCreator } from './elements/nodes/nodeTypes';
import { ScrollFrame } from './elements/ScrollFrame';



export class Editor {
    scrollFrame: ScrollFrame = Nil;
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
    uiMap: NodeManager = Nil;
    tmpSelection: Selection = Nil;
    whenClick: WhenClick = Nil;

    isInitialized = false;

    constructor(settings: SettingRecevier) {
        for (const name in settings) this.settings[name] = settings[name];
        this.uiMap = new NodeManager(this);
        regisStyleSheet(this);
        registryEvents(this);

        if (!this.settings.lazyInit) {
            this.initialize()
        }

    }

    setSettings(settings: SettingRecevier) {
        for (const name in settings) this.settings[name] = settings[name];
    }

    initialize(settings?: SettingRecevier) {
        if (this.isInitialized) return;

        if (settings) {
            for (const name in settings) this.settings[name] = settings[name];
        }

        this.scrollFrame = creEle(this, 'scroll-frame', this.settings.container);
        this.eventManager.triggleEvent(Constants.events.DOC_TREE_CREATED);
        listenUserClick(this);
        listenSelectionToSetCursor(this);
        listenTextInput(this);

        this.docTree.addEventListener('selection_change', sele => {
            console.log(sele);
        })

        this.isInitialized = true;
    }

    render(document: string | MapObj) {
        if (!this.isInitialized) {
            this.initialize();
        }

        if ( !document 
            || (typeof document === 'string' && document.trim() === '')
            || (typeof document === 'object' && Object.keys(document).length === 0)
        ) {
            document = this.settings.document;
        }

        this.docTree.buildTree(document);

        this.viewLines.innerHTML = '';
        this.docTree.render();
    }

    regisSetCursorPositionBehavior(nodeType: string, behavior: CursorPositionBehavior) {
        this.setCursorPositionBehaviorSet.set(nodeType, behavior);
    }

    regisSetSelectionWhenClickBehaviorSet(nodeType: string, behavior: SetSelectionBehavior) {
        this.setSelectionWhenClickBehaviorSet.set(nodeType, behavior);
    }

    regisKeyDownBehavior(nodeType: string, behavior: KeyDownBehavior) {
        this.keyDownBehaviorSet.set(nodeType, behavior);
    }

    sizeFollowOutContainer() {
        if(this.scrollFrame) this.scrollFrame.updateSize();
    }
}