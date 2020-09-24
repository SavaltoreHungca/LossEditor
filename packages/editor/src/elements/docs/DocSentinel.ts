import { DocNode } from "./DocNode";
import { Editor } from "../../Editor";
import { $$ } from "utils";

export interface DocSentinal extends DocNode {

}

export function docSentinelExt(editor: Editor){

    return (sentinel: HTMLElement)=> {
        $$.setStyle(sentinel, {
            cursor: 'text',
            overflow: 'hidden',
            'text-overflow': 'ellipsis'
        });

        return {

        }
    }
}