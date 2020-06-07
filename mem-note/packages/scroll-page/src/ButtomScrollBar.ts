import { Element } from "./other/Element";
import Constants from "./Constants";

export default class extends Element {

    __init__(){
        if (this.global.settings.bottomScrollBarInner) {
            // 离开停止显示底部滚动条
            this.addEventListener('mouseleave', () => {
                this.disappear(1500);
            })
        }
    }

}