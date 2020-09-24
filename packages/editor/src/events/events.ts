import { regisNodeRenderer } from './regisNodeRenderer'
import { regisSetSelectionBehavior } from './regisSetSelectionBehavior'
import { regisSetCursorPositionBehavior } from './regisSetCursorPositionBehavior'
import { regisTextInputBehavior } from './regisTextInputBehavior'
import { regisTypesettingBehavior } from './regisTypesettingBehavior'
import { Editor } from '../Editor'
import { regisEmptyOrgnizerBehavior } from './regisEmptyOrgnizerBehavior'
import { regisKeyDownBehavior } from './regisKeyDownBehavior'

export function registryEvents(editor: Editor) {
    regisNodeRenderer(editor);
    regisSetSelectionBehavior(editor);
    regisSetCursorPositionBehavior(editor);
    regisTextInputBehavior(editor);
    regisTypesettingBehavior(editor);
    regisEmptyOrgnizerBehavior(editor);
    regisKeyDownBehavior(editor);
}










