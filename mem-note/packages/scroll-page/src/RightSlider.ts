import { Element } from "./other/Element";
import Constants from "./Constants";
import { DragState } from "utils";

export default class extends Element {

    __init__() {
        // 拖动底部 slider 的拖动事件
        this.addEventListener('drag', (e: DragState) => {
            if (e.pressed === false) { // 拖动事件结束
                this.lightenColor();
                return;
            }
            this.darkenColor();
            const {
                page,
                rightScrollBar,
                topshallow
            } = this.global.getAll();
            const rightSliderInfo = this.getInfo();
            const rightScrollBarInfo = rightScrollBar.getInfo();
            const pageInfo = page.getInfo();

            let offset = rightSliderInfo.top + e.deltaY;
            if(rightScrollBarInfo.innerHeight < pageInfo.innerHeight){
                topshallow.show();
            }
            if (offset <= 0) {
                offset = 0;
                topshallow.disappear();
            } else if (offset >= rightScrollBarInfo.innerHeight - rightSliderInfo.innerHeight) {
                offset = rightScrollBarInfo.innerHeight - rightSliderInfo.innerHeight;
            }
            this.setTop(offset + 'px');
            page.setTop(- pageInfo.innerHeight / rightScrollBarInfo.innerHeight * offset + 'px');
        })
        this.addEventListener('mousemove', () => {
            this.darkenColor();
            this.setLastTimeout(Constants.timeout.RIGHT_SLIDER_FADE_TIMEOUT,
                () => {
                    this.lightenColor();
                }, 1000);
        })
        this.addEventListener('mouseleave', () => {
            this.lightenColor();
        })
    }

    lightenColor() {
        this.setStyle({
            background: 'hsla(0,0%,39%,.4)'
        })
    }
    darkenColor() {
        this.cancelLastTimeout(Constants.timeout.RIGHT_SLIDER_FADE_TIMEOUT);
        this.setStyle({
            background: 'hsla(0,0%,39%,.7)'
        })
    }

}