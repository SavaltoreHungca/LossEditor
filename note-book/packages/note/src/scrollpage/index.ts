import { Div } from './../compoentDefinitions';
import { Component } from "../compoentDefinitions";
import { ScrollWin } from "./components/ScrollWin";

export function makeScrollable(container: HTMLElement){
    if(container.children.length !== 1){
        throw new Error("容器下只能有一个元素");
    }


    const srollWin = new ScrollWin(new Div(), 100, 100);
}