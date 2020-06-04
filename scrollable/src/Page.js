import Element from "./Element";
import Constants from "./Constants";

export default class extends Element {

    constructor(global) {
        super(global.creatElemt('div'), global);
        this.global.page = this;
        this.setRole("Page");

        this.setStyle({
            position: 'absolute', width: '100%', "min-width": '500px',
            height: '1000px', contain: 'strict', overflow: 'hidden'
        })
    }

    setWidth(num){
        this.setStyle(num + 'px');
        this.global.state.triggerEvent(Constants.events.PAGE_WIDTH_CHANGE);
    }

}