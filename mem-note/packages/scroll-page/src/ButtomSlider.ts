import Constants from "./Constants";
import { Element } from "./other/Element";
import { DragState, Utils } from "utils";

export default class extends Element {
    __init__() {
        // 拖动底部 slider 的拖动事件
        this.addEventListener('drag', (e: DragState) => {
            const {
                page,
                buttomScrollBar,
                rightshallow,
                buttomSlider
            } = this.global.getAll();
            if (e.pressed === false) { // 拖动事件结束
                this.lightenColor();
                return;
            }
            this.darkenColor();
            const buttomSliderInfo = buttomSlider.getInfo();
            let buttomScrollBarInfo = buttomScrollBar.getInfo();
            let pageInfo = page.getInfo();

            let offset = buttomSliderInfo.left + e.deltaX;

            if (buttomScrollBarInfo.innerWidth < pageInfo.innerWidth) {
                rightshallow.show();
            }
            if (offset <= 0) {
                offset = 0;
            } else if (offset >= buttomScrollBarInfo.innerWidth - buttomSliderInfo.innerWidth) {
                offset = buttomScrollBarInfo.innerWidth - buttomSliderInfo.innerWidth;
                rightshallow.disappear();
            }
            buttomSlider.setLeft(offset + 'px');
            page.setLeft(- pageInfo.innerWidth / buttomScrollBarInfo.innerWidth * offset + 'px');
        })

        this.addEventListener('mousemove', () => {
            this.darkenColor();
            this.setLastTimeout(Constants.timeout.BUTTOM_SLIDER_FADE_TIMEOUT,
                () => {
                    this.lightenColor();
                }, 1000);
        })

        this.addEventListener('mouseleave', () => {
            this.lightenColor();
        })

        if (this.global.settings.bottomScrollBarInner) {
            this.addEventListener('drag', (e: DragState) => {
                const {
                    buttomScrollBar,
                } = this.global.getAll();

                const path: [] = Utils.get(e.event, 'path');
                if (e.pressed === false && !Utils.in(this.proxy, path)) { // 拖动事件结束
                    buttomScrollBar.disappear(1500);
                    return;
                }
                buttomScrollBar.show();
            })
        }
    }

    lightenColor() {
        this.setStyle({
            background: 'hsla(0,0%,39%,.4)'
        })
    }
    darkenColor() {
        this.cancelLastTimeout(Constants.timeout.BUTTOM_SLIDER_FADE_TIMEOUT);
        this.setStyle({
            background: 'hsla(0,0%,39%,.7)'
        })
    }
}