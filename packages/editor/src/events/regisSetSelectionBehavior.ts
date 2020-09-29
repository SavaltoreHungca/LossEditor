import { Editor } from "../Editor";
import { Constants } from "../Constants";
import { paragraphSelectionBehaviorFactory } from "../behaviors/paragraph/paragraphSelectionBehavior";
import { sentinelSelectionBehaviorFactory } from "../behaviors/sentinel/sentinelSelectionBehavior";

export function regisSetSelectionBehavior(editor: Editor) {
    editor.eventManager.bindEventOn(Constants.events.DOC_TREE_CREATED, () => {
        editor.regisSetSelectionWhenClickBehaviorSet('paragraph', paragraphSelectionBehaviorFactory(editor))
        editor.regisSetSelectionWhenClickBehaviorSet('sentinel', sentinelSelectionBehaviorFactory(editor))
    });
}