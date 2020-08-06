import { Editor } from "./Editor";
import { Constants } from "./Constants";
import { $$, DragState, innerHtml, extend, $ } from "utils";
import { paragraphRendererFactor } from "./render/paragraph";
import { captionImageRendererFactory } from "./render/captionImage";
import { tableRendererFactory, rowRendererFactory, cellRendererFactory } from "./render/table";
import { paragraphSelectionBehavior } from "./selection/paragraphSelectionBehavior";
import { setCursorPositionForParagraph } from "./selection/cursorposition/paragraphCursorPosition";
import { sentinelRendererFactory } from "./render/sentinel";
import { setCursorPositionForSentinel } from "./selection/cursorposition/sentinelCursorPosition";
import { sentinelSelectionBehavior } from "./selection/sentinelSelectionBehavior";
import { paragraphTextInputBehaviorFactory } from "./textinput/paragraphTextInputBehavior";
import { sentinelTextInputBehaviorFactory } from "./textinput/sentinelTextInputBehavior";
import { textInputRendererFactor } from "./render/textInput";
import { imageRendererFactory } from "./render/image";
import { paragraphBackspaceFactory } from "./textinput/backspace/paragraphBackspceBehavior";
import { paragraphTypesettingFactory } from "./typesetting/paragraphTypesetting";
import { Cursor } from "./elements/elementTypes";
import { creEle } from "./elements/creEle";

export function registryEvents(editor: Editor) {
    initializeUi(editor);
    regisNodeRenderer(editor);
    regisSetSelectionBehavior(editor);
    regisSetCursorPositionBehavior(editor);
    regisTextInputBehavior(editor);
    regisTypesettingBehavior(editor);
}


function initializeUi(editor: Editor) {
    editor.eventManager.bindEventAtLeastExecOnceOn([Constants.events.CONTAINER_SETED],
        Constants.events.ELEMENTS_CREATED,
        () => {
            const containerInfo = editor.container.getInfo();
            const idset = {
                viewlines: $$.randmonId(),
                backlayer: $$.randmonId(),
                cursor: $$.randmonId(),
                region: $$.randmonId(),
            }
            innerHtml(editor.container, `
                <div data-ele-type="view-lines" id="${idset.viewlines}"
                    style="top: ${containerInfo.innerTop}px; left: ${containerInfo.innerLeft}px; width: ${containerInfo.innerWidth}px;"></div>

                <div data-ele-type="back-layer" id="${idset.backlayer}"
                    style="top: ${containerInfo.innerTop}px; left: ${containerInfo.innerLeft}px; z-index: -1">
                    <textarea data-ele-type="cursor" id="${idset.cursor}"></textarea>
                    <div data-ele-type="region-container" id="${idset.region}"
                        style="top: ${containerInfo.innerTop}px; left: ${containerInfo.innerLeft}px; width: ${containerInfo.innerWidth}px; z-index: -1"></div>
                </div>
            `);
            editor.viewLines = creEle(editor, 'view-lines', $(idset.viewlines));
            editor.backLayer = creEle(editor, 'back-layer', $(idset.backlayer));
            editor.regionContainer = creEle(editor, 'region-container', $(idset.region));
            editor.cursor = creEle(editor, 'cursor', $(idset.cursor));
        })
}

function regisNodeRenderer(editor: Editor) {
    editor.eventManager.bindEventOn(Constants.events.DOC_TREE_CREATED, () => {
        editor.docTree.regisRenderer('root', (parent, node) => { })
        editor.docTree.regisRenderer('sentinel', sentinelRendererFactory(editor));
        editor.docTree.regisRenderer('paragraph', paragraphRendererFactor(editor));
        editor.docTree.regisRenderer('textInput', textInputRendererFactor(editor));
        editor.docTree.regisRenderer('image', imageRendererFactory(editor));
        editor.docTree.regisRenderer('captionImage', captionImageRendererFactory(editor));
        editor.docTree.regisRenderer('table', tableRendererFactory(editor));
        editor.docTree.regisRenderer('row', rowRendererFactory(editor));
        editor.docTree.regisRenderer('cell', cellRendererFactory(editor));
    });
}

function regisSetSelectionBehavior(editor: Editor) {
    editor.eventManager.bindEventOn(Constants.events.DOC_TREE_CREATED, () => {
        editor.docTree.regisSetSelectionBehavior('paragraph', paragraphSelectionBehavior)
        editor.docTree.regisSetSelectionBehavior('sentinel', sentinelSelectionBehavior)
    });
}

function regisSetCursorPositionBehavior(editor: Editor) {
    editor.regisSetCursorPositionBehavior('paragraph', setCursorPositionForParagraph);
    editor.regisSetCursorPositionBehavior('sentinel', setCursorPositionForSentinel);
}

function regisTextInputBehavior(editor: Editor) {
    editor.eventManager.bindEventOn(Constants.events.DOC_TREE_CREATED, () => {
        editor.docTree.regisTextInputBehavior('paragraph', paragraphTextInputBehaviorFactory(editor));
        editor.docTree.regisTextInputBehavior('sentinel', sentinelTextInputBehaviorFactory(editor));

        editor.docTree.regisBackSpceBehavior('paragraph', paragraphBackspaceFactory(editor));
    })
}

function regisTypesettingBehavior(editor: Editor) {
    editor.eventManager.bindEventOn(Constants.events.DOC_TREE_CREATED, () => {
        editor.docTree.regisTypesettingBehavior('paragraph', paragraphTypesettingFactory(editor));
    })
}