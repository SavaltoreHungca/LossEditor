import { Editor } from "../Editor";
import { Constants } from "../Constants";
import { paragraphSelectionBehavior } from "../selection/paragraphSelectionBehavior";
import { sentinelSelectionBehavior } from "../selection/sentinelSelectionBehavior";

export function regisSetSelectionBehavior(editor: Editor) {
    editor.eventManager.bindEventOn(Constants.events.DOC_TREE_CREATED, () => {
        editor.docTree.regisSetSelectionBehavior('paragraph', paragraphSelectionBehavior)
        editor.docTree.regisSetSelectionBehavior('sentinel', sentinelSelectionBehavior)
    });
}