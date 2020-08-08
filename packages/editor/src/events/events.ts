import { initializeUi } from './initializeUi'
import { regisNodeRenderer } from './regisNodeRenderer'
import { regisSetSelectionBehavior } from './regisSetSelectionBehavior'
import { regisSetCursorPositionBehavior } from './regisSetCursorPositionBehavior'
import { regisTextInputBehavior } from './regisTextInputBehavior'
import { regisTypesettingBehavior } from './regisTypesettingBehavior'
import { Editor } from '../Editor'

export function registryEvents(editor: Editor) {
    initializeUi(editor);
    regisNodeRenderer(editor);
    regisSetSelectionBehavior(editor);
    regisSetCursorPositionBehavior(editor);
    regisTextInputBehavior(editor);
    regisTypesettingBehavior(editor);
}










