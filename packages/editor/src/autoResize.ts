import { Utils } from 'utils';
import { Editor } from './Editor';

export function listenContainerSizeChange(editor: Editor){
    editor.dataListener.addLoop(()=>{
        const containerInfo = Utils.getElementInfo(editor.container);
        const viewLinesInfo = Utils.getElementInfo(editor.viewLines);

        if(containerInfo.innerWidth !== viewLinesInfo.width){
            editor.updateSize();
        }
    })
}