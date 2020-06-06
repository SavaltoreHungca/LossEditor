import { Element as Ele, Global as G } from "utils";
import {EventManager} from 'event-driven';
import { Settings } from "../Settings";

export class Element extends Ele {
    global: Global;

    constructor(element: HTMLElement, global: Global) {
        super(element, global);
        this.global = global
        this.__init__();
    }
    protected __init__(){

    }
    setWidth(wdith: string){
        this.setStyle({width: wdith});
        this.global.eventManager.triggleEvent(`${this.getType().toUpperCase()}_WIDTH_CHANGE`);
    }

    setHeight(height: string){
        this.setStyle({height: height});
        this.global.eventManager.triggleEvent(`${this.getType().toUpperCase()}_HEIGHT_CHANGE`);
    }

    setLeft(left: string){
        this.setStyle({left: left});
        this.global.eventManager.triggleEvent(`${this.getType().toUpperCase()}_LEFT_CHANGE`);
    }

    setRight(right: string){
        this.setStyle({right: right});
        this.global.eventManager.triggleEvent(`${this.getType().toUpperCase()}_RIGHT_CHANGE`);
    }

    setTop(top: string){
        this.setStyle({top: top});
        this.global.eventManager.triggleEvent(`${this.getType().toUpperCase()}_TOP_CHANGE`);
    }

    setBottom(bottom: string){
        this.setStyle({bottom: bottom});
        this.global.eventManager.triggleEvent(`${this.getType().toUpperCase()}_BUTTOM_CHANGE`);
    }
    
}

export class Global extends G{
    eventManager: EventManager;
    settings: Settings;

    constructor(eventManager: EventManager, settings: Settings){
        super();
        this.eventManager = eventManager;
        this.settings = settings;
    }

    getAll(){
        let ans: {[index: string]: Element} = {};
        this.globalElement.forEach((value, key)=>{
            ans[key] = value as Element;
        })
        return ans;
    }
}