import { Nil } from '.';
import { HtmlUtil } from './HtmlUtil';

interface DragCallbacks {
    onclick: (ev: DragEvent) => any;
    onmove: (ev: DragEvent) => any;
    onover: (ev: DragEvent) => any;
    setOnclick: (callback: (ev: DragEvent) => any) => DragCallbacks;
    setOnmove: (callback: (ev: DragEvent) => any) => DragCallbacks;
    setOnover: (callback: (ev: DragEvent) => any) => DragCallbacks;
}

interface DragEvent {
    startX: number;
    startY: number;
    pressed: boolean;
    registered: boolean;
    deltaX: number;
    deltaY: number;
    oriEvent: Event;
}

interface MousePosition {
    left: number,
    top: number,
    bottom: number,
    right: number,
    leaved: boolean
}

export class MouseUtil {

    /**
     * 鼠标悬浮事件
     * @param ele 
     * @param callback 
     */
    static mouseHover(ele: Element, callback: (status: 'hover' | 'leave') => void) {
        ele.addEventListener('mouseover', () => {
            callback('hover');
        });
        ele.addEventListener('mouseout', () => {
            callback('leave');
        })
    }

    /**
     * 
     * @param element 
     * @param isStopPropergation 是否允许事件冒泡
     */
    static mouseDrag(element: HTMLElement, isStopPropergation: boolean) {
        const dragEvent: DragEvent = {
            startX: 0,
            startY: 0,
            pressed: false,
            deltaX: 0,
            deltaY: 0,
            registered: false,
            oriEvent: Nil
        }

        const callbacks: DragCallbacks =
        {
            onclick: () => { },
            onmove: () => { },
            onover: () => { },
            setOnclick: (callback) => {
                callbacks.onclick = callback;
                return callbacks;
            },
            setOnmove: (callback) => {
                callbacks.onmove = callback;
                return callbacks;
            },
            setOnover: (callback) => {
                callbacks.onover = callback;
                return callbacks;
            },
        }

        const startResize = (event: MouseEvent) => {
            if (dragEvent.pressed && !dragEvent.registered) {
                dragEvent.registered = true;
                document.addEventListener('mousemove', resizing);
                document.addEventListener('mouseup', resizeDone);
                document.removeEventListener('mousemove', startResize);
            }
        };
        const resizing = (event: MouseEvent) => {
            if (dragEvent.pressed && dragEvent.registered) {
                dragEvent.deltaX = event.screenX - dragEvent.startX;
                dragEvent.deltaY = event.screenY - dragEvent.startY;
                dragEvent.startX += dragEvent.deltaX;
                dragEvent.startY += dragEvent.deltaY;
                dragEvent.oriEvent = event;
                callbacks.onmove(dragEvent);
            }
        };
        const resizeDone = (event: MouseEvent) => {
            if (dragEvent.pressed) {
                dragEvent.pressed = false;
                dragEvent.registered = false;
                dragEvent.oriEvent = event;
                callbacks.onover(dragEvent);
                document.removeEventListener('mousemove', resizing);
                document.removeEventListener('mouseup', resizeDone);
                element.removeEventListener('mouseup', resizeDone);
            }
        };
        element.addEventListener('mousedown', (event) => {
            dragEvent.startX = event.screenX;
            dragEvent.startY = event.screenY;
            dragEvent.pressed = true;
            dragEvent.registered = false;
            dragEvent.oriEvent = event;
            callbacks.onclick(dragEvent);
            document.addEventListener('mousemove', startResize);
            element.addEventListener('mouseup', resizeDone);
        });

        return callbacks;
    }

    static getMousePositionInElement(elemt: HTMLElement, event: MouseEvent): MousePosition {
        const { clientX, clientY } = event;
        const eleInfo = HtmlUtil.getElementInfo(elemt);
        const position = elemt.getBoundingClientRect();
        const left = clientX - position.x;
        const top = clientY - position.y;
        const bottom = eleInfo.innerHeight - top;
        const right = eleInfo.innerWidth - left;
        let leaved = left < 0 || top < 0 || bottom < 0 || right < 0;
        return {
            left: left,
            top: top,
            bottom: bottom,
            right: right,
            leaved: leaved
        }
    }


    /**
     * 
     * @param elemt 需要添加菜单功能的对象
     * @param listener contextMenuContainer: 菜单的容器; cancelMenu: 取消菜单; makeVisible: 让菜单在视图内; evt: 原始事件
     * @param whenCancelMenu 取消菜单时的回调
     */
    static addContextMenu(
        elemt: HTMLElement,
        listener: (contextMenuContainer: HTMLElement, opration: { cancelMenu: () => void, makeVisible: () => void }, evt: MouseEvent) => void, 
        whenCancelMenu?: () => void) {

        elemt.addEventListener('contextmenu', (e: MouseEvent) => {
            e.preventDefault();
            const moousePosi = MouseUtil.getMousePositionInElement(document.body, e);

            const contextMenu: HTMLElement = document.createElement('div');
            HtmlUtil.setStyle(contextMenu, {
                position: 'fixed'
            });
            document.body.appendChild(contextMenu);

            HtmlUtil.setStyle(contextMenu, {
                left: moousePosi.left,
                top: moousePosi.top,
            });

            const makeVisible = () => {
                const menuInfo = HtmlUtil.getElementInfo(contextMenu);
                const rectInfo = contextMenu.getBoundingClientRect();

                // 高度超出
                if (rectInfo.top + menuInfo.height > window.innerHeight) {
                    HtmlUtil.setStyle(contextMenu, {
                        top: menuInfo.top - (rectInfo.top + menuInfo.height - window.innerHeight),
                    });
                }

                // 宽度超出
                if (rectInfo.left + menuInfo.width > window.innerWidth) {
                    HtmlUtil.setStyle(contextMenu, {
                        left: menuInfo.left - (rectInfo.left + menuInfo.width - window.innerWidth)
                    })
                }
            }

            const stopPropagation = (e: MouseEvent) => {
                e.stopPropagation();
            }
            const cancel = () => {
                document.body.removeChild(contextMenu);
                window.removeEventListener('click', cancel);
                window.removeEventListener('contextmenu', cancelCon);
                if (whenCancelMenu) whenCancelMenu();
            }

            // 避免第一次打开就被关闭
            let firstContextMenu = true
            const cancelCon = () => {
                if (firstContextMenu) {
                    firstContextMenu = false;
                    return;
                }
                cancel();
            }

            window.addEventListener('click', cancel);
            window.addEventListener('contextmenu', cancelCon);
            contextMenu.addEventListener('click', stopPropagation);
            contextMenu.addEventListener('contextmenu', stopPropagation);


            listener(contextMenu, {
                cancelMenu: () => { cancel() },
                makeVisible: makeVisible
            }, e);

            makeVisible();
        })
    }
}