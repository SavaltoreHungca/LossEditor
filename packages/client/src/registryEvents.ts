import { MemLoss } from "./MemLoss";
import { Constants } from "./Constants";

export function registryEvents(memLoss: MemLoss) {

    // 组装元素
    memLoss.eventManager.registryEventDpendsOn([
        Constants.events.ELEMENTS_BUILD_FINISH,
    ],() => {
        console.log('shit');
        const { container, sidePad, editorFrame, sidePadResizingBar } = memLoss.global.getAll();
        container.append(sidePad);
        sidePad.append(sidePadResizingBar);
        container.append(editorFrame);
    }, Constants.events.ELEMENTS_ASSEMBLE_FINISH);

    // 初始化 UI 样式
    memLoss.eventManager.registryEventDpendsOn([
        Constants.events.ELEMENTS_ASSEMBLE_FINISH,
    ],() => {
        const { container, sidePad, editorFrame, sidePadResizingBar } = memLoss.global.getAll();
        const containerInfo = container.getInfo();
        sidePad.setStyle({
            position: 'absolute',
            left: 0,
            top: 0,
            width: 275,
            height: containerInfo.innerHeight,
            background: 'rgb(247, 246, 243)'
        });
        const sidePadInfo = sidePad.getInfo();
        sidePadResizingBar.setStyle({
            position: 'absolute',
            right: 0,
            top: 0,
            width: 3,
            height: sidePadInfo.innerHeight,
            'box-shadow': 'rgba(0,0,0,0.1) 2px 0px 0px',
            cursor: 'col-resize',
            background: 'rgba(0, 0, 0, 0.1)'
        });
        sidePadResizingBar.addClass('hover-show');
        editorFrame.setStyle({
            position: 'absolute',
            left: sidePadInfo.width,
            top: 0,
            width: containerInfo.width - sidePadInfo.width,
            height: containerInfo.innerHeight
        })
    }, Constants.events.UI_INITIALIZED_OK)
}