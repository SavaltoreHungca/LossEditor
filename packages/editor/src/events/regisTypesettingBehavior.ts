import { Editor } from "../Editor";
import { Constants } from "../Constants";
import { paragraphTypesettingFactory } from "../behaviors/paragraph/paragraphTypesetting";

export function regisTypesettingBehavior(editor: Editor) {
    editor.eventManager.bindEventOn(Constants.events.DOC_TREE_CREATED, () => {
        editor.docTree.regisTypesettingBehavior('paragraph', paragraphTypesettingFactory(editor));
    })
}