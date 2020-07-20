import { Editor } from "./Editor";
import { Constants } from "./Constants";
import { Utils, DragState } from "utils";
import { paragraphRendererFactor } from "./render/paragraph";
import { captionImageRendererFactory } from "./render/captionImage";
import { tableRendererFactory, rowRendererFactory, cellRendererFactory } from "./render/table";
import { Node, SetSelectionResult, Point } from 'editor-core';
import { getNodeFromChild, paragraphProps, getType } from "./utils";
import { paragraphSelectionBehavior } from "./selection/paragraphSelectionBehavior";
import { setCursorPositionForParagraph } from "./selection/cursorposition/paragraphCursorPosition";
import { sentinelRendererFactory } from "./render/sentinel";
import { setCursorPositionForSentinel } from "./selection/cursorposition/sentinelCursorPosition";
import { sentinelSelectionBehavior } from "./selection/sentinelSelectionBehavior";
import { paragraphTextInputBehaviorFactory } from "./textinput/paragraphTextInputBehavior";
import { sentinelTextInputBehaviorFactory } from "./textinput/sentinelTextInputBehavior";

export function registryEvents(editor: Editor) {
    initializeUi(editor);
    setNodeUiMap(editor);
    regisNodeRenderer(editor);
    regisSetSelectionBehavior(editor);
    regisSetCursorPositionBehavior(editor);
    regisTextInputBehavior(editor);
}


function initializeUi(editor: Editor) {
    editor.eventManager.registryEventDpendsOn([
        Constants.events.ELEMENTS_CREATED
    ], () => {
        Utils.setStyle(editor.container, {
            "white-space": "pre",
            position: "relative",
            "font-family": 'Menlo, Monaco, "Courier New", monospace',
            "font-weight": 'normal',
            "font-size": '12px',
            "font-feature-settings": '"liga" 0, "calt" 0',
            "line-height": '18px',
            "letter-spacing": '0px',
            height: 'fit-content',
            outline: 'none',
            'user-select': 'none',
        });
        editor.container.setAttribute('tabindex', '1');
        editor.container.appendChild(editor.viewLines);
        const containerInfo = Utils.getElementInfo(editor.container);
        Utils.setStyle(editor.viewLines, {
            top: containerInfo.innerTop,
            left: containerInfo.innerLeft,
            width: containerInfo.innerWidth,
        });
        editor.container.appendChild(editor.backLayer);
        Utils.setStyle(editor.backLayer, {
            top: containerInfo.innerTop,
            left: containerInfo.innerLeft,
            'z-index': '-1'
        });
        editor.backLayer.appendChild(editor.cursor);
        Utils.setStyle(editor.regionContainer, {
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0,
            'z-index': '-1'
        })
        editor.backLayer.appendChild(editor.regionContainer);
    }, 'initialized-ui-ok')
}

function setNodeUiMap(editor: Editor) {
    editor.eventManager.registryEventDpendsOn([Constants.events.DOC_TREE_ROOT_SETED], () => {
        editor.docTree.walkTree(node => {
            if (node.type === 'root') {
                editor.uiMap.setElement(node, editor.viewLines);
            } else {
                editor.uiMap.setElement(node, document.createElement('div'));
            }
        })
    }, 'node-ui-map-seted');
}

function regisNodeRenderer(editor: Editor) {
    editor.eventManager.registryEventDpendsOn([Constants.events.DOC_TREE_CREATED], () => {
        editor.docTree.regisRenderer('root', (parent, node) => { })
        editor.docTree.regisRenderer('sentinel', sentinelRendererFactory(editor));
        editor.docTree.regisRenderer('paragraph', paragraphRendererFactor(editor));
        editor.docTree.regisRenderer('captionImage', captionImageRendererFactory(editor));
        editor.docTree.regisRenderer('table', tableRendererFactory(editor));
        editor.docTree.regisRenderer('row', rowRendererFactory(editor));
        editor.docTree.regisRenderer('cell', cellRendererFactory(editor));
    }, 'regis-node-renderer-ok');
}

function regisSetSelectionBehavior(editor: Editor) {
    editor.eventManager.registryEventDpendsOn([Constants.events.DOC_TREE_CREATED], () => {
        editor.docTree.regisSetSelectionBehavior('paragraph', paragraphSelectionBehavior)
        editor.docTree.regisSetSelectionBehavior('sentinel', sentinelSelectionBehavior)
    }, 'regis-set-selection-behavior-ok');
}

function regisSetCursorPositionBehavior(editor: Editor) {
    editor.regisSetCursorPositionBehavior('paragraph', setCursorPositionForParagraph);
    editor.regisSetCursorPositionBehavior('sentinel', setCursorPositionForSentinel);
}

function regisTextInputBehavior(editor: Editor) {
    editor.eventManager.registryEventDpendsOn([Constants.events.DOC_TREE_CREATED], () => {
        editor.docTree.regisTextInputBehavior('paragraph', paragraphTextInputBehaviorFactory(editor));
        editor.docTree.regisTextInputBehavior('sentinel', sentinelTextInputBehaviorFactory(editor));
    }, 'regis-textinput-behavior-ok')
}