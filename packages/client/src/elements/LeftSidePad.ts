import { LeftDirectoryTree } from './LeftDirectoryTree';
import { MemLoss } from './../MemLoss';
import { Element } from "./Element";
import { innerHtml, $$, $ } from 'utils';
import { ResizeBar } from './ResizeBar';
import { FunctionMenu } from './FunctionMenu';
import { NodeListPad } from './NodeListPad';
import { creEle } from './elementTypes';
import { classes } from '../styleClassSheet';

export interface LeftSidePad extends Element {
    resizeBar: ResizeBar
    functionMenu: FunctionMenu
    leftDirectoryTree: LeftDirectoryTree
}

export function leftSidePadExt(memloss: MemLoss) {
    return (leftSidePad: Element) => {
        leftSidePad.setStyle({
            'min-width': memloss.settings.leftSidePadMinWidth
        })

        const idSet = {
            resizeBar: $$.randmonId(),
            functionMenu: $$.randmonId(),
            leftDirectoryTree: $$.randmonId(),
        }

        innerHtml(leftSidePad, `
            <div id="${idSet.resizeBar}" class="${classes.hoverShow}"
                style="position: absolute; right: 0px; top: 0px; width: 5px; height: 100%; box-shadow: rgba(0, 0, 0, 0.1) 2px 0px 0px; cursor: col-resize; background: rgba(0, 0, 0, 0.1); z-index: 101;">
            </div>
            <div id="${idSet.functionMenu}" style="width: 100%; "></div>
            <div id="${idSet.leftDirectoryTree}" style="flex-grow: 1; width: 100%;"></div>
        `)

        const ext = {
            resizeBar: creEle(memloss, 'resizeBar', $(idSet.resizeBar)),
            functionMenu: creEle(memloss, 'functionMenu', $(idSet.functionMenu)),
            leftDirectoryTree: creEle(memloss, 'leftDirectoryTree', $(idSet.leftDirectoryTree)),
        };

        return ext;
    }
}