import { Editor } from './Editor';
import { Constants } from './Constants';
import { Utils } from 'utils';
import { getType } from './utils';

// #e5ebf1
export function listenSelectionChangeToSetSelectedRegion(editor: Editor) {
    editor.eventManager.registryEvent(Constants.events.SELECTION_CHANGE, () => {
        const selection = editor.selection;
        if (!selection) return;
        if (selection.isCollapsed) return;

        const endPoint = selection.end;
        const startPoint = selection.start;
        const ancestor = selection.ancestor;
        if (!endPoint || !startPoint ) throw new Error();
        // if (!endPoint || !startPoint || !ancestor) throw new Error();

        // switch (getType(ancestor)) {
        //     case 'text': {
        //         const position = Utils.getRelativePosition(ancestor, editor.viewLines);
        //         const region = document.createElement('div');
        //         editor.regionContainer.innerHTML = '';
        //         editor.regionContainer.appendChild(region);

        //         const startwidth = Utils.getStrPx(startPoint.node.innerText.substring(0, startPoint.offset), startPoint.node).width;
        //         const endwidth = Utils.getStrPx(endPoint.node.innerText.substring(0, endPoint.offset), endPoint.node).width;

        //         Utils.setStyle(region, {
        //             position: 'absolute',
        //             display: 'block',
        //             background: '#add6ff',
        //             left: position.left + (startwidth > endwidth ? endwidth : startwidth),
        //             top: position.top,
        //             width: Math.abs(startwidth - endwidth),
        //             height: ancestor.offsetHeight,
        //             'border-radius': '3px 3px 3px 3px',
        //             'z-index': '-1'
        //         });

        //         break;
        //     }
        // }
    });
}

function setRegionForText() {

}