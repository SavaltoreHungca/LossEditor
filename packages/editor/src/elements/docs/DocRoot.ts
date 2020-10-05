import { DocNode } from "./DocNode";
import { Editor } from "../../Editor";
import { $$ } from "utils";

export interface DocRoot extends DocNode {

}

export function docRootExt(editor: Editor){

    return (docRoot: HTMLElement)=> {
        return {

        }
    }
}