import { Editor } from "../Editor";
import { Constants } from "../Constants";
import { paragraphSelectionBehaviorFactory } from "../selection/paragraphSelectionBehavior";
import { sentinelSelectionBehaviorFactory } from "../selection/sentinelSelectionBehavior";

export function regisSetSelectionBehavior(editor: Editor) {
    editor.eventManager.bindEventOn(Constants.events.DOC_TREE_CREATED, () => {
        editor.regisSetSelectionWhenClickBehaviorSet('paragraph', paragraphSelectionBehaviorFactory(editor))
        editor.regisSetSelectionWhenClickBehaviorSet('sentinel', sentinelSelectionBehaviorFactory(editor))
    });
}