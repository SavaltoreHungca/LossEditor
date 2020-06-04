import Element from "./Element";
import Constants from "./Constants";
import Utils from "./Utils";

class Slider extends Element {
    constructor(global) {
        super(global.creatElemt('div'), global);
        this.setRole("ButtomScrollBarSlider");
        this.setStyle({
            position: 'absolute',
            background: 'hsla(0,0%,39%,.4)',
            height: '14px'
        })
    }

    darkenColor() {
        this.setStyle({
            background: 'hsla(0,0%,39%,.7)'
        })
    }

    lightenColor() {
        this.setStyle({
            background: 'hsla(0,0%,39%,.4)'
        })
    }
}

export default class extends Element {
    slider = undefined;

    constructor(global) {
        super(global.creatElemt('div'), global);
        global.buttomScrollBar = this;
        this.setRole("ButtomScrollBar");
        this.slider = new Slider(global);
        this.append(this.slider);

        this.setStyle({
            position: 'absolute',
            bottom: '0',
            left: '0',
            height: '14px',
            visibility: 'hidden'
        });

        this.global.state.registryListener([
            Constants.events.EDIT_ELEMENT_WIDTH_CHANGE,
            Constants.events.PAGE_WIDTH_CHANGE
        ], () => {
            let editwidth = global.editElement.getInfo().innerWidth;
            let pagewidth = global.page.getInfo().innerWidth;

            this.slider.setStyle({
                width: editwidth / pagewidth * editwidth + 'px'
            });
            this.setStyle({
                width: editwidth + 'px'
            });
            if (editwidth >= pagewidth) {
                this.setStyle({ display: "none" });
            } else {
                this.setStyle({ display: "block" });
            }
        });
        this._initialDrag();
    }

    setSliderOffset(num) {
        this.slider.setStyle({ left: num + 'px' });
    }

    // 初始化拖动事件
    _initialDrag() {
        // 在 editElement 上的鼠标滚轮事件
        this.global.editElement.addEventListener("wheel", (e) => {
            e.stopPropagation();
            e.preventDefault();
            let { top, left, innerWidth } = this.global.page.getInfo();
            let editElementInfo = this.global.editElement.getInfo();

            let offset = {
                x: left - e.deltaX
            }
            this.global.editElement.rightShallow.scrollShow();
            if (editElementInfo.innerWidth >= innerWidth || offset.x >= 0) {
                offset.x = 0;
            } else if (offset.x <= editElementInfo.innerWidth - innerWidth) { // 到达右边极限
                offset.x = editElementInfo.innerWidth - innerWidth;
                this.global.editElement.rightShallow.disappear();
            }

            this.global.page.setStyle({
                left: offset.x + 'px'
            });
            this.global.buttomScrollBar.setSliderOffset((-offset.x) * editElementInfo.innerWidth / innerWidth);
            this.global.buttomScrollBar.show();
            this.global.buttomScrollBar.disappear(1500);
        })

        // 决定是否显示 底部滚动条 
        this.global.editElement.addEventListener('mousemove', (e) => {
            let { offsetX, offsetY } = e;
            let info = this.global.editElement.getInfo();
            let buttomBarInfo = this.global.buttomScrollBar.getInfo();
            if (info.height - offsetY <= buttomBarInfo.height) {
                this.global.buttomScrollBar.cancelDisappear();
                this.global.buttomScrollBar.show();
            } else if (Utils.in(this.global.buttomScrollBar.proxy, e.path)) {
                this.global.buttomScrollBar.cancelDisappear();
                this.global.buttomScrollBar.show();
            } else {
                this.global.buttomScrollBar.disappear(1500);
            }
        });

        // 离开停止显示底部滚动条
        this.global.editElement.addEventListener('mouseleave', (e) => {
            this.global.buttomScrollBar.disappear(1500);
        })

        this.addEventListener('mouseleave', (e) => {
            this.global.buttomScrollBar.disappear(1500);
        })

        // 拖动底部 slider 的拖动事件
        this.slider.addEventListener('drag', (e) => {
            if (e.pressed === false) { // 拖动事件结束
                this.slider.lightenColor();
                if (!Utils.in(this.proxy, e.path)) {
                    this.disappear(1500);
                }
                return;
            }
            this.slider.darkenColor();
            this.show();
            let { top, left, innerWidth } = this.slider.getInfo();
            let editElementInfo = this.global.editElement.getInfo();
            let pageElementInfo = this.global.page.getInfo();

            let offset = {
                x: left + e.deltaX
            }
            this.global.editElement.rightShallow.scrollShow();
            if (offset.x <= 0) {
                offset.x = 0;
            } else if (offset.x >= editElementInfo.innerWidth - innerWidth) {
                offset.x = editElementInfo.innerWidth - innerWidth;
                this.global.editElement.rightShallow.disappear();
            }
            this.slider.setStyle({ left: offset.x + 'px' });
            this.global.page.setStyle({
                left: (- pageElementInfo.innerWidth / editElementInfo.innerWidth * offset.x) + 'px'
            });
        })
        this.slider.addEventListener('mousemove', () => {
            this.slider.darkenColor();
            this.slider.setLastTimeout(Constants.timeout.BUTTOM_SLIDER_FADE_TIMEOUT,
                () => {
                    this.slider.lightenColor();
                }, 1000);
        })
        this.slider.addEventListener('mouseleave', () => {
            this.slider.lightenColor();
        })
    }
}