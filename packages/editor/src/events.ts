import { Editor } from "./Editor";
import { Constants } from "./Constants";
import { Utils } from "utils";

export function registryEvents(editor: Editor) {
    initializeUi(editor);
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