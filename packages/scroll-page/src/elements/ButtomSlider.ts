import { ScrollPage } from "../ScrollPage"
import { Element } from './Element';
import { $$ } from "utils";

export interface ButtomSlider extends Element {
    dragging: boolean
    lightenColor(): void
    darkenColor(): void
}

export function buttomSliderExt(sp: ScrollPage) {
    return (ele: HTMLElement) => {
        const sf = <Element>ele;
        return {
            isDarken: false,
            lightenColor: function () {
                this.isDarken = false;
                $$.removeStyle(sf, 'background');
            },
            darkenColor: function () {
                if (!this.isDarken) {
                    sf.setStyle({
                        background: 'hsla(0,0%,39%,.7)'
                    })
                    this.isDarken = true;
                }
            },
            dragging: false,
            getType: () => 'ButtomSlider'
        }
    }
}