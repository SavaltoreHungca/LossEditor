import { UiElement } from "./UiElement"
import { Editor } from "../Editor"
import { $, $$, ct, DragState, innerHtml } from "utils"
import { creEle } from "./elementTypes";
import { ScrollPage } from "scroll-page";
import { classes } from "../styleClassSheet";

export interface ScrollFrame extends UiElement { 
    updateSize(size?: {
        width?: number | string;
        height?: number | string;
    }): void
}

export function scrollFrameExt(editor: Editor) {
    return (ele: UiElement)=>{
        const idset = {
            container: $$.randmonId(),
            resizeBar: $$.randmonId()
        }

        // scroll frame 在这里同时也是 scrollpage 的 container
        innerHtml(ele, `
            <div style="padding: 37px; width: fit-content; ">
                <div style="position: relative; padding: 10px; border: 1px solid; width: fit-content">
                    <div id="${idset.resizeBar}" class="${classes.hoverShow}" style="position: absolute; right: 0px; top: 0px; height: 100%; width: 2px; background: black; cursor: col-resize; "></div>

                    <div id="${idset.container}"></div>
                </div>
            </div>
        `);

        editor.container = creEle(editor, 'container', $(idset.container));

        $$.addDragEvent($(idset.resizeBar), (dragstate: DragState)=>{
            
        })

        const scrollPage = new ScrollPage({
            container: ele,
            containerWidth: editor.settings.width,
            containerHeight: editor.settings.height,
        });

        return {
            updateSize: function(size?: {
                width?: number | string;
                height?: number | string;
            }){
                if(size){
                    scrollPage.setContainerSize(size);
                }
                else {
                    scrollPage.containerSizeFollowOuter();
                }
            }
        }
    }
}