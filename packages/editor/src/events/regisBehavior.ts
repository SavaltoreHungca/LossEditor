import { Editor } from "../Editor";
import { Constants } from "../Constants";
import { paragraphRendererFactor } from "../render/paragraph";
import { tableRendererFactory, rowRendererFactory, cellRendererFactory } from "../render/table";
import { sentinelRendererFactory } from "../render/sentinel";
import { paragraphTextInputBehaviorFactory } from "../behaviors/paragraph/paragraphTextInputBehavior";
import { sentinelTextInputBehaviorFactory } from "../behaviors/sentinel/sentinelTextInputBehavior";
import { paragraphBackspaceFactory } from "../behaviors/paragraph/paragraphBackspceBehavior";
import { rootEmptyOrgnizerFactory } from "../behaviors/root/rootEmptyOrgnizerFactory";
import { paragraphTypesettingFactory } from "../behaviors/paragraph/paragraphTypesetting";
import { paragraphKeyDownBehavior } from "../behaviors/paragraph/paragraphKeyDownBehavior";
import { paragraphSelectionBehaviorFactory } from "../behaviors/paragraph/paragraphSelectionBehavior";
import { sentinelSelectionBehaviorFactory } from "../behaviors/sentinel/sentinelSelectionBehavior";
import { setCursorPositionForParagraph } from "../behaviors/paragraph/paragraphCursorPosition";
import { setCursorPositionForSentinel } from "../behaviors/sentinel/sentinelCursorPosition";

export function regisBehavior(editor: Editor) {
    editor.eventManager.bindEventOn(Constants.events.DOC_TREE_CREATED, () => {
        editor.docTree.regisBehavior('root', 'EmptyOrgnizerNodeRnderBehavior', rootEmptyOrgnizerFactory(editor));
        editor.docTree.regisBehavior('root', 'Renderer', (parent, node) => { });


        editor.docTree.regisBehavior('paragraph', 'Renderer', paragraphRendererFactor(editor));
        editor.docTree.regisBehavior('paragraph', 'BackSpaceBehavior', paragraphBackspaceFactory(editor));
        editor.docTree.regisBehavior('paragraph', 'TypeSettingBehavior', paragraphTypesettingFactory(editor));
        editor.docTree.regisBehavior('paragraph', 'TextInputBehavior', paragraphTextInputBehaviorFactory(editor));
        editor.regisBehavior('paragraph', 'CursorPositionBehavior', setCursorPositionForParagraph);
        editor.regisBehavior('paragraph', 'SetSelectionBehavior', paragraphSelectionBehaviorFactory(editor))
        editor.regisBehavior('paragraph', 'KeyDownBehavior', paragraphKeyDownBehavior(editor));


        editor.docTree.regisBehavior('sentinel', 'Renderer', sentinelRendererFactory(editor));
        editor.docTree.regisBehavior('sentinel', 'TextInputBehavior', sentinelTextInputBehaviorFactory(editor));
        editor.regisBehavior('sentinel', 'SetSelectionBehavior', sentinelSelectionBehaviorFactory(editor))
        editor.regisBehavior('sentinel', 'CursorPositionBehavior', setCursorPositionForSentinel);

        editor.docTree.regisBehavior('table', 'Renderer', tableRendererFactory(editor));
        editor.docTree.regisBehavior('row', 'Renderer', rowRendererFactory(editor));
        editor.docTree.regisBehavior('cell', 'Renderer', cellRendererFactory(editor));
    });
}