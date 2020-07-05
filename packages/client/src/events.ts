import { MemLoss } from "./MemLoss";
import { Constants } from "./Constants";
import { ScrollPage } from 'scroll-page';
import { Utils } from "utils";
import { createElement } from "./Element";
import { Editor } from "editor";
import { editorcontent } from "./testdata";

export function registryEvents(memLoss: MemLoss) {
    assembleElements(memLoss);
    initializeUi(memLoss);
    initializeSidePad(memLoss);
    initializeEditors(memLoss);
}

function assembleElements(memLoss: MemLoss) {
    memLoss.eventManager.registryEventDpendsOn([
        Constants.events.ELEMENTS_BUILD_FINISH,
    ], () => {
        const { container, sidePad, editorFrame, sidePadResizingBar, nodeListPad, opendPages, functionMenu } = memLoss.elements;
        container.appendChild(sidePad);
        sidePad.appendChild(sidePadResizingBar);
        sidePad.appendChild(opendPages);
        sidePad.appendChild(nodeListPad);
        sidePad.appendChild(functionMenu);
        container.appendChild(editorFrame);
    }, Constants.events.ELEMENTS_ASSEMBLE_FINISH);
}

function initializeUi(memLoss: MemLoss) {
    memLoss.eventManager.registryEventDpendsOn([
        Constants.events.ELEMENTS_ASSEMBLE_FINISH,
    ], () => {
        const { container, sidePad, editorFrame, sidePadResizingBar, nodeListPad, opendPages, functionMenu } = memLoss.elements;
        const containerInfo = container.getInfo();
        sidePad.setStyle({
            position: 'absolute',
            display: 'block',
            left: 0,
            top: 0,
            width: 275,
            height: containerInfo.innerHeight,
            background: 'rgb(247, 246, 243)'
        });

        sidePad.getInfo(sidePadInfo => {
            sidePadResizingBar.addClass('hover-show');
            sidePadResizingBar.setStyle({
                position: 'absolute',
                right: 0,
                top: 0,
                width: 3,
                height: sidePadInfo.innerHeight,
                'box-shadow': 'rgba(0,0,0,0.1) 2px 0px 0px',
                cursor: 'col-resize',
                background: 'rgba(0, 0, 0, 0.1)',
                'z-index': 101
            });

            opendPages.setStyle({
                width: "100%",
                height: 200
            })
            functionMenu.setStyle({
                width: "100%",
                height: 300
            })

            Utils.getElementInfoBatch((opendPagesInfo, functionMenuInfo) => {
                nodeListPad.setStyle({
                    width: "100%",
                    height: sidePadInfo.innerHeight - opendPagesInfo.height - functionMenuInfo.height
                })
                nodeListPad.nodeList.setStyle({
                    width: sidePadInfo.innerWidth
                })
            }, opendPages, functionMenu)

            editorFrame.setStyle({
                position: 'absolute',
                left: sidePadInfo.width,
                top: 0,
                width: containerInfo.width - sidePadInfo.width,
                height: containerInfo.innerHeight
            })
            editorFrame.topBar.setStyle({
                height: 45,
                width: '100%'
            });
            editorFrame.bottomPad.setStyle({
                width: '100%'
            })
            Utils.getElementInfoBatch((frameinfo, topinof, bottominfo) => {
                editorFrame.editorWindowsContainer.setStyle({
                    height: frameinfo.innerHeight - topinof.height - bottominfo.height,
                    width: '100%'
                })
            }, editorFrame, editorFrame.topBar, editorFrame.bottomPad)
        });
    }, Constants.events.UI_INITIALIZED_OK)
}

function initializeSidePad(memLoss: MemLoss) {
    memLoss.eventManager.registryEventDpendsOn([
        Constants.events.UI_INITIALIZED_OK
    ], () => {
        const { nodeListPad } = memLoss.elements;
        new ScrollPage(nodeListPad.nodeList, {
            containerWidth: '100%',
            containerHeight: '100%',
            rightScrollBarWidth: 5
        })
    }, 'initialize-side-pad-ok');
}

function initializeEditors(memLoss: MemLoss) {
    memLoss.eventManager.registryEventDpendsOn([
        Constants.events.UI_INITIALIZED_OK
    ], () => {
        const { editorFrame } = memLoss.elements;
        const e = createElement(memLoss, 'ceshinimabi');
        let editor;
        editorFrame.editorWindowsContainer.appendChild(e);
        e.setWidth(3000);
        e.setHeight(3000);
        editor = new Editor(e);
        editor.render(editorcontent);
        editorFrame.editorWindowsContainer.getInfo(info => {
            new ScrollPage(e, {
                containerHeight: info.innerHeight + 'px',
                containerWidth: info.innerWidth + 'px'
            })
        });
    }, 'initialize-editors-ok');
}