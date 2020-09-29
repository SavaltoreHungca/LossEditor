import { Editor } from "../Editor";
import { rootEmptyOrgnizerFactory } from "../behaviors/root/rootEmptyOrgnizerFactory";
import { Constants } from "../Constants";

export function regisEmptyOrgnizerBehavior(editor: Editor) {
    editor.eventManager.bindEventOn(Constants.events.DOC_TREE_CREATED, () => {
        editor.docTree.regisEmptyOrgnizerNodeRnderBehavior('root', rootEmptyOrgnizerFactory(editor));
    });
}