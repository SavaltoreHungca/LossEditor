import { Utils } from 'utils';
import { ScrollPage } from 'scroll-page';
import { Element } from "./other/Element";

export class SidePad extends Element {
    nodeListPad: HTMLElement | undefined;
    nodeList: Array<HTMLElement> = []

    __init__(){
        this.nodeListPad = document.createElement('div');
        this.appendNative(this.nodeListPad);
        Utils.setStyle(this.nodeListPad, {
            height: 600
        })
        new ScrollPage(this.nodeListPad);
    }

    getType(){
        return "SidePad";
    }
}