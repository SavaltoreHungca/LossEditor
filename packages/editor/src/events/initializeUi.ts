import { Editor } from "../Editor";
import { Constants } from "../Constants";
import { $$, DragState, innerHtml, extend, $ } from "utils";
import { creEle } from "../elements/elementTypes";

export function initializeUi(editor: Editor) {
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
                <div id="${idset.viewlines}" style="top: ${containerInfo.innerTop}px; left: ${containerInfo.innerLeft}px; width: ${containerInfo.innerWidth}px;"></div>

                <div id="${idset.backlayer}"
                    style="top: ${containerInfo.innerTop}px; left: ${containerInfo.innerLeft}px; z-index: -1">
                    <textarea id="${idset.cursor}"></textarea>
                    <div id="${idset.region}"
                        style="top: ${containerInfo.innerTop}px; left: ${containerInfo.innerLeft}px; width: ${containerInfo.innerWidth}px; z-index: -1"></div>
                </div>
            `);
            editor.viewLines = creEle(editor, 'view-lines', $(idset.viewlines));
            editor.backLayer = creEle(editor, 'back-layer', $(idset.backlayer));
            editor.regionContainer = creEle(editor, 'region-container', $(idset.region));
            editor.cursor = creEle(editor, 'cursor', $(idset.cursor));
        })
}