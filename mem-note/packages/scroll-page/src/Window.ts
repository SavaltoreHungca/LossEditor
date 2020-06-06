import Constants from "./Constants";
import { Element } from "./other/Element";

export default class extends Element {

    __init__() {
        this.addEventListener('wheel', (e: WheelEvent) => {
            e.stopPropagation();
            e.preventDefault();
            let {
                container,
                window,
                page,
                buttomScrollBar,
                rightScrollBar,
                topshallow,
                rightshallow,
                buttomSlider,
                rightSlider
            } = this.global.getAll();

            const pageInfo = page.getInfo();
            const buttomScrollBarInfo = buttomScrollBar.getInfo();

            let offset = pageInfo.left - e.deltaX;
            if (buttomScrollBarInfo.innerWidth < pageInfo.innerWidth) {
                rightshallow.show();
            }
            if (buttomScrollBarInfo.innerWidth >= pageInfo.innerWidth || offset >= 0) {
                offset = 0;
            } else if (offset <= buttomScrollBarInfo.innerWidth - pageInfo.innerWidth) { // 到达右边极限
                offset = buttomScrollBarInfo.innerWidth - pageInfo.innerWidth;
                rightshallow.disappear();
            }

            page.setLeft(offset + 'px');
            console.log(-offset * buttomScrollBarInfo.innerWidth / pageInfo.innerWidth + 'px');
            buttomSlider.setLeft(-offset * buttomScrollBarInfo.innerWidth / pageInfo.innerWidth + 'px');
            buttomScrollBar.show();
            buttomScrollBar.disappear(1500);
        })

        // this.addEventListener('mousemove', (e: MouseEvent) => {
        //     let {
        //         container,
        //         window,
        //         page,
        //         buttomScrollBar,
        //         rightScrollBar,
        //         topshallow,
        //         rightshallow,
        //         buttomSlider,
        //         rightSlider
        //     } = this.global.getAll();

        //     let { offsetX, offsetY } = e;
        //     let windowInfo = window.getInfo();
        //     let buttomBarInfo = this.global.buttomScrollBar.getInfo();
        //     if (windowInfo.innerHeight - offsetY <= buttomBarInfo.height) {
        //         this.global.buttomScrollBar.cancelDisappear();
        //         this.global.buttomScrollBar.show();
        //     } else if (Utils.in(this.global.buttomScrollBar.proxy, e.path)) {
        //         this.global.buttomScrollBar.cancelDisappear();
        //         this.global.buttomScrollBar.show();
        //     } else {
        //         this.global.buttomScrollBar.disappear(1500);
        //     }
        // });
    }

}