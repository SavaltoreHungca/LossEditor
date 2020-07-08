import { repository } from './repository/Request';
import { MemLoss } from "./MemLoss";
import { EditorFrameElement, createElement, EditorWindowCon, randomId, $, WindowElement } from "./Element";
import { Node } from "./renderNodeList";
import { Editor } from "editor";
import { ScrollPage } from 'scroll-page';

export function renderWindow(memloss: MemLoss, editorFrame: EditorFrameElement, nodeParents: Array<Node>, node: Node) {
    const container = editorFrame.editorWindowsContainer;
    const opendWindow = container.opendWindow;

    createWindow(memloss, container, nodeParents, node);
    // if(opendWindow) for(const window of opendWindow){
    //     if(node.id in window.tabs){
    //         return;
    //     }
    // }

    // if (opendWindow.length > 0) {

    // } else {
    //     createWindow(memloss, container, nodeParents, node);
    // }
}

function createWindow(memloss: MemLoss, container: EditorWindowCon, nodeParents: Array<Node>, node: Node) {

    const idset = {
        window: randomId(),
        editorContainer: randomId(),
        editorElemt: randomId(),
        crumbs: randomId(),
    }
    
    container.innerHTML = `
        <div data-mem-loss-type="window" id="${idset.window}" style="overflow: hidden; display: flex; flex-direction: column; height: 100%; width:100%">
            <div data-mem-loss-type="tabsContainer">
                <div data-mem-loss-type="tabs">
                    <span class="background-change-selected" style="display: inline-block; position: relative; box-sizing: border-box; cursor: pointer">
                        <span style="display: flex; flex-direction: column; justify-content: center;overflow: hidden; height: 35px; width: 125px; text-align: center;">
                            <div>${node.title}</div>
                        </span>
                    </span>
                </div>
            </div>
            <div data-mem-loss-type="crumbs" id="${idset.crumbs}"></div>
            <div data-mem-loss-type="editorContainer" id="${idset.editorContainer}" style="flex-grow: 1; overflow: hidden">
                <div data-mem-loss-type="editor" id="${idset.editorElemt}" style="width: 600px; height: 600px">
            </div>
        </div>
    `

    const path = [...nodeParents, node];
    renderCrumbs(memloss, $(idset.crumbs), path);

    const srollpage = new ScrollPage($(idset.editorElemt));
    const editor = new Editor($(idset.editorElemt))
    $(idset.window)['editor'] = editor;
    $(idset.window)['scrollPage'] = srollpage;
    editor.render(repository.getNodeContent(node.id, (status, data) => {
        switch (status) {
            case 'ok':
                if (!data) throw new Error();
                editor.render(data);
                break;
        }
    }))
    container.opendWindow.push(<WindowElement>$(idset.window))
}


function renderCrumbs(memloss: MemLoss, container: HTMLElement, path: Array<Node>){
    // const latest = path.length - 1;
    path.forEach((node, index)=>{
        const unit = createElement(memloss, 'crumbs-unit', 'span')
        unit.innerHTML = `
            <div style="display: flex; flex-direction: column; justify-content: center">
                <div style="">
                    <span>/</span>
                    <span>${node.title}</span>
                </div>
            </div>
        `
        container.appendChild(unit);
    })
}