import { Editor } from "../Editor";
import { Constants } from "../Constants";
import { paragraphTextInputBehaviorFactory } from "../behaviors/paragraph/paragraphTextInputBehavior";
import { sentinelTextInputBehaviorFactory } from "../behaviors/sentinel/sentinelTextInputBehavior";
import { paragraphBackspaceFactory } from "../behaviors/paragraph/paragraphBackspceBehavior";

export function regisTextInputBehavior(editor: Editor) {
    editor.eventManager.bindEventOn(Constants.events.DOC_TREE_CREATED, () => {
        editor.docTree.regisTextInputBehavior('paragraph', paragraphTextInputBehaviorFactory(editor));
        editor.docTree.regisTextInputBehavior('sentinel', sentinelTextInputBehaviorFactory(editor));

        editor.docTree.regisBackSpceBehavior('paragraph', paragraphBackspaceFactory(editor));
    })
}