import { repository } from './repository/Request';
import { MemLoss } from "./MemLoss";
import { Constants } from "./Constants";
import { ScrollPage } from 'scroll-page';
import { createElement, randomId, $, wrapElement, NodeListElement, EditorFrameElement, SidePadElement, WindowElement } from "./Element";
import { Editor } from "editor";
import { renderNodeList } from "./renderNodeList";
import { DragState, Utils } from "utils";
import { renderWindow } from './renderWindows';

export function registryEvents(memLoss: MemLoss) {
    initializeUi(memLoss);
    initializeSidePad(memLoss);
    initializeEditors(memLoss);
    allowResizeSidePadWidth(memLoss);
}

function initializeUi(memLoss: MemLoss) {
    memLoss.eventManager.registryEventDpendsOn([
        Constants.events.ELEMENTS_BUILD_FINISH,
    ], () => {
        const { container } = memLoss.elements;
        if (!container) throw new Error('container uninitialize');
        container.setStyle({
            display: 'flex'
        });

        const idSet = {
            sidePadId: randomId(),
            nodeListId: randomId(),
            content: randomId(),
            editorFrame: randomId(),
            editorWindowsContainer: randomId(),
            resizeBar: randomId(),
        }

        const functions = [
            ['Settings &amp; Members', 'fa-cog'],
            ['Quick Search', 'fa-search']
        ].map(item => {
            return `
                <div class="background-change-selected" style="cursor: pointer;display: flex; align-items: center; min-height: 27px; font-size: 14px; width: 100%;">
                    <div style="flex-shrink: 0; flex-grow: 0; border-radius: 3px; color: rgba(55, 53, 47, 0.6); width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; margin-right: 4px;">
                        <i class="fa ${item[1]}" aria-hidden="true"></i>
                    </div>
                    <div style="flex: 1 1 auto; white-space: nowrap; min-width: 0px; overflow: hidden; text-overflow: ellipsis;">
                        ${item[0]}
                    </div>
                </div>
            `
        }).join('');
        container.innerHTML = `
            <div data-mem-loss-type="sidePad" id="${idSet.sidePadId}"
                style="position: relative; display: flex; flex-direction: column; height: 100%; background: rgb(247, 246, 243); user-select: none">
                <div data-mem-loss-type="sidePadResizingBar" id="${idSet.resizeBar}" class=" hover-show"
                    style="position: absolute; right: 0px; top: 0px; width: 5px; height: 100%; box-shadow: rgba(0, 0, 0, 0.1) 2px 0px 0px; cursor: col-resize; background: rgba(0, 0, 0, 0.1); z-index: 101;">
                </div>
                <div data-mem-loss-type="functionMenu" style="width: 100%; ">
                    ${functions}
                </div>
                <div data-mem-loss-type="nodeListPad" style="flex-grow: 1; width: 100%; display: flex; flex-direction: column;">
                    <div data-mem-loss-type="nodeList" id="${idSet.nodeListId}" style="flex-grow: 1; overflow: hidden">
                        <div data-mem-loss-type="nodeListContent" id="${idSet.content}"></div>
                    </div>
                    <div data-mem-loss-type="addNewPageButton" class="background-change-selected"
                        style="height: 45px; cursor: pointer; box-shadow: rgba(55, 53, 47, 0.09) 0px -1px 0px;display: flex; align-items: center; min-height: 27px; font-size: 14px; width: 100%; color: rgba(55, 53, 47, 0.6); height: 45px;">
                        <div
                            style="flex-shrink: 0; flex-grow: 0; border-radius: 3px; color: rgba(55, 53, 47, 0.6); width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; margin-right: 4px;">
                            <i class="fa fa-plus" aria-hidden="true"></i>
                        </div>
                        <div
                            style="flex: 1 1 auto; white-space: nowrap; min-width: 0px; overflow: hidden; text-overflow: ellipsis;">
                            New page
                        </div>
                    </div>
                </div>
            </div>
            <div data-mem-loss-type="editorFrame" id="${idSet.editorFrame}"
                style="display: flex; flex-direction: column; flex-grow: 1; position: relative; width: auto; height: 100%; overflow: hidden">
                <div data-mem-loss-type="editorWindowsContainer" id="${idSet.editorWindowsContainer}" 
                    style="display: block; position: relative; flex-grow: 1; height: 300px; overflow: hidden"></div>
            </div>
        `

        $(idSet.editorWindowsContainer)['opendWindow'] = new Array<WindowElement>();
        $(idSet.nodeListId)['content'] = wrapElement(memLoss, $(idSet.content), 'nodeListContent');
        $(idSet.editorFrame)['editorWindowsContainer'] = wrapElement(memLoss, $(idSet.editorWindowsContainer), 'editorWindowsContainer');
        $(idSet.sidePadId)['sidePadResizingBar'] = wrapElement(memLoss, $(idSet.resizeBar), 'sidePadResizingBar');

        memLoss.elements.nodeList = <NodeListElement>wrapElement(memLoss, $(idSet.nodeListId), 'nodeList');
        memLoss.elements.editorFrame = <EditorFrameElement>wrapElement(memLoss, $(idSet.editorFrame), 'editorFrame');
        memLoss.elements.sidPad = <SidePadElement>wrapElement(memLoss, $(idSet.sidePadId), 'sidePad');

    }, Constants.events.UI_INITIALIZED_OK)
}

function initializeSidePad(memLoss: MemLoss) {
    memLoss.eventManager.registryEventDpendsOn([
        Constants.events.UI_INITIALIZED_OK
    ], () => {
        const { nodeList } = memLoss.elements;
        if (!nodeList) throw new Error();

        repository.getNodeList((status, data) => {
            switch (status) {
                case 'ok':
                    if (!data) throw Error();
                    renderNodeList(memLoss, [], data.list, 1, item => nodeList.content.appendChild(item));

                    const scrollPage = new ScrollPage(nodeList.content, {
                        rightScrollBarWidth: 5,
                        contentFollowContainerWidth: true,
                        showRightShallow: false,
                        hiddenRightScrollBar: true,
                        hiddenBottomScrollBar: true
                    })

                    nodeList.scrollPage = scrollPage;
                    break;
            }
        })

    }, 'initialize-side-pad-ok');
}

function initializeEditors(memLoss: MemLoss) {
    memLoss.eventManager.registryEventDpendsOn([
        Constants.events.UI_INITIALIZED_OK
    ], () => {
        const { editorFrame } = memLoss.elements;
        if (!editorFrame) throw new Error();

    }, 'initialize-editors-ok');
}

function allowResizeSidePadWidth(memLoss: MemLoss) {
    memLoss.eventManager.registryEventDpendsOn([
        Constants.events.UI_INITIALIZED_OK
    ], () => {
        const { sidPad, editorFrame, nodeList } = memLoss.elements;
        if (!sidPad || !editorFrame || !nodeList) throw new Error();
        Utils.addEventListener('drag', <HTMLElement>sidPad.sidePadResizingBar, (e: DragState) => {
            // nodeList.scrollPage.settings
            const sidPadInfo = sidPad.getInfo();
            const editorFrameInfo = editorFrame.getInfo();
            sidPad.setWidth(sidPadInfo.width + e.deltaX);
            editorFrame.setWidth(editorFrameInfo.width - e.deltaX);
        })

    }, 'allow-resize-sidepad-width-ok')
}