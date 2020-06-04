import Element from "./Element";
import Constants from "./Constants";
import Utils from "./Utils";

class Slider extends Element {
    constructor(global) {
        super(global.creatElemt('div'), global);
        this.setRole("RightScrollBarSlider");
        this.setStyle({
            position: 'absolute',
            background: 'hsla(0,0%,39%,.4)',
            width: '14px'
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
        this.global.rightScrollBar = this;
        this.setRole("RightScrollBar");
        this.slider = new Slider(global);
        this.append(this.slider);

        this.setStyle({
            position: 'absolute',
            right: '0',
            top: '0',
            width: '14px'
        });
        this.global.state.registryListener(
            [
                Constants.events.EDIT_ELEMENT_HEIGHT_CHANGE,
                Constants.events.PAGE_HEIGHT_CHANGE
            ],
            () => {
                let editheight = global.editElement.getInfo().innerHeight;
                let pageheight = global.page.getInfo().innerHeight;

                this.slider.setStyle({
                    height: editheight / pageheight * editheight + 'px'
                });
                this.setStyle({
                    height: editheight + 'px'
                });
                if (editheight >= pageheight){
                    this.setStyle({ display: "none" });
                    let editorInfo = this.global.editor.getInfo();
                    this.global.editElement.setWidth(editorInfo.width);
                } else {
                    this.setStyle({ display: "block" });
                    let editorInfo = this.global.editor.getInfo();
                    this.global.editElement.setWidth(editorInfo.width - 14);
                }
            }
        );
        this._initialDrag();
    }

    setSliderOffset(num) {
        this.slider.setStyle({ top: num + 'px' });
    }


    // 初始化拖动事件
    _initialDrag() {
        // 在 editElement 上的鼠标滚轮事件
        this.global.editElement.addEventListener("wheel", (e) => {
            e.stopPropagation();
            e.preventDefault();
            let { top, left, innerHeight } = this.global.page.getInfo();
            let editElementInfo = this.global.editElement.getInfo();

            let offset = {
                y: top - e.deltaY
            }
            this.global.editElement.topShallow.scrollShow();
            if (editElementInfo.innerHeight >= innerHeight || offset.y >= 0) {
                offset.y = 0;
                this.global.editElement.topShallow.disappear();
            } else if (offset.y <= editElementInfo.innerHeight - innerHeight) { // 到达右边极限
                offset.y = editElementInfo.innerHeight - innerHeight;
            }

            this.global.page.setStyle({
                top: offset.y + 'px',
            });
            this.global.rightScrollBar.setSliderOffset((-offset.y) * editElementInfo.innerHeight / innerHeight);
            this.global.rightScrollBar.show();
        })

        // 拖动底部 slider 的拖动事件
        this.slider.addEventListener('drag', (e) => {
            if (e.pressed === false) { // 拖动事件结束
                this.slider.lightenColor();
                return;
            }
            this.slider.darkenColor();
            let { top, left, innerHeight } = this.slider.getInfo();
            let editElementInfo = this.global.editElement.getInfo();
            let pageElementInfo = this.global.page.getInfo();

            let offset = {
                y: top + e.deltaY
            }
            this.global.editElement.topShallow.scrollShow();
            if (offset.y <= 0) {
                offset.y = 0;
                this.global.editElement.topShallow.disappear();
            } else if (offset.y >= editElementInfo.innerHeight - innerHeight) {
                offset.y = editElementInfo.innerHeight - innerHeight;
            }
            this.slider.setStyle({ top: offset.y + 'px' });
            this.global.page.setStyle({
                top: (- pageElementInfo.innerHeight / editElementInfo.innerHeight * offset.y) + 'px'
            });
        })
        this.slider.addEventListener('mousemove', () => {
            this.slider.darkenColor();
            this.slider.setLastTimeout(Constants.timeout.RIGHT_SLIDER_FADE_TIMEOUT,
                () => {
                    this.slider.lightenColor();
                }, 1000);
        })
        this.slider.addEventListener('mouseleave', () => {
            this.slider.lightenColor();
        })
    }
}