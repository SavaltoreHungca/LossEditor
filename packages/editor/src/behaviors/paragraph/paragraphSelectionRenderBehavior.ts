import { $$, ct } from 'utils';
import { Editor } from '../../Editor';
import { Point } from "editor-core";
import { DocParagraph } from '../../elements/docs/DocParagraph';
import { getType } from '../../utils';
import { Text } from '../../elements/Text';
import { NodeParagraph } from '../../elements/nodes/NodeParagraph';
import { lstat } from 'fs';
import { Selection } from 'editor-core';

// 渲染选区行为
export function paragraphSelectionRenderBehavior(editor: Editor) {
    return (selection: Selection, shouldSelectAll: boolean) => {
        

    }
}