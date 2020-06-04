import Element from "./Element";

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

    constructor(global){
        super(global.creatElemt('div'), global);
        this.global.rightScrollBar = this;
        this.setRole("RightScrollBar");
        this.slider = new Slider(global);
        this.append(this.slider);

        this.setStyle({
            position: 'absolute',
            right: '0',
            top: '0',
            width: '14px',
            // visibility: 'hidden'
        });

        global.state.registry(
            () => {
                return {
                    editheight: global.editElement.getInfo().innerHeight
                }
            },
            (context) => {
                this.slider.setStyle({
                    height: 50 + 'px'
                });
                this.setStyle({
                    height: context.editheight + 'px'
                });
            }
        );
    }
}