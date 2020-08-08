import { Editor } from "../Editor";
import { Constants } from "../Constants";
import { paragraphRendererFactor } from "../render/paragraph";
import { tableRendererFactory, rowRendererFactory, cellRendererFactory } from "../render/table";
import { sentinelRendererFactory } from "../render/sentinel";

export function regisNodeRenderer(editor: Editor) {
    editor.eventManager.bindEventOn(Constants.events.DOC_TREE_CREATED, () => {
        editor.docTree.regisRenderer('root', (parent, node) => { })
        editor.docTree.regisRenderer('sentinel', sentinelRendererFactory(editor));
        editor.docTree.regisRenderer('paragraph', paragraphRendererFactor(editor));
        editor.docTree.regisRenderer('table', tableRendererFactory(editor));
        editor.docTree.regisRenderer('row', rowRendererFactory(editor));
        editor.docTree.regisRenderer('cell', cellRendererFactory(editor));
    });
}
