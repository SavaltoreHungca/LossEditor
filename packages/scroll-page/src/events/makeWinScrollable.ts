import { ScrollPage } from '../ScrollPage';
import Constants from '../Constants';
export function makeWinScrollable(sp: ScrollPage) {
    sp.eventManager.bindEventOn(Constants.events.ASSEMBLE_ELEMENTS_FINISH, () => {
        const { window: win } = sp.elements;
        if (!win) throw new Error();
        // 水平滚动事件
        win.addEventListener('wheel', (e: WheelEvent) => {
            e.stopPropagation();
            e.preventDefault();

            if (e.deltaX === 0) return;

            let { page, buttomScrollBar, buttomSlider, } = sp.elements;
            if (!page || !buttomScrollBar || !buttomSlider) throw new Error();

            const pageInfo = page.getInfo();
            const buttomScrollBarInfo = buttomScrollBar.getInfo();

            let offset = pageInfo.left - e.deltaX;
            if (buttomScrollBarInfo.innerWidth >= pageInfo.innerWidth || offset >= 0) {
                offset = 0;
            } else if (offset <= buttomScrollBarInfo.innerWidth - pageInfo.innerWidth) { // 到达右边极限
                offset = buttomScrollBarInfo.innerWidth - pageInfo.innerWidth;
            }

            page.setLeft(offset);
            buttomSlider.setLeft(-offset * buttomScrollBarInfo.innerWidth / pageInfo.innerWidth);
        });
        // 垂直滚动事件
        win.addEventListener('wheel', (e: WheelEvent) => {
            if (e.deltaY === 0) return;
            let { page, rightScrollBar, rightSlider } = sp.elements;
            if (!page || !rightScrollBar || !rightSlider) throw new Error();

            const pageInfo = page.getInfo();
            const rightScrollBarInfo = rightScrollBar.getInfo();

            let offset = pageInfo.top - e.deltaY;
            if (rightScrollBarInfo.innerHeight >= pageInfo.innerHeight || offset >= 0) {
                offset = 0;
            } else if (offset <= rightScrollBarInfo.innerHeight - pageInfo.innerHeight) {
                offset = rightScrollBarInfo.innerHeight - pageInfo.innerHeight;
            }

            page.setTop(offset);
            rightSlider.setTop(-offset * rightScrollBarInfo.innerHeight / pageInfo.innerHeight);
        })
    })

}