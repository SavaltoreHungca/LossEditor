import Element from "./Element";
import Page from './Page';
import ButtomScrollBar from './ButtomScrollBar';
import Constants from "./Constants";

class TopShallow extends Element{
    constructor(global){
        super(global.creatElemt('div'), global);
        this.setRole('TopShallow');

        this.setStyle({
            position: 'absolute',
            left: '0',
            top: '0',
            height: '6px',
            'box-shadow': '#dddddd 0 6px 6px -6px inset'
        })
        this.disappear();
    }

    scrollShow(){
        if(this.global.editElement.getInfo().innerHeight < this.global.page.getInfo().innerHeight){
            this.show();
        }
    }
}

class RightShallow extends Element{
    constructor(global){
        super(global.creatElemt('div'), global);
        this.setRole('RightShallow');

        this.setStyle({
            position: 'absolute',
            right: '0',
            top: '0',
            width: '6px',
            'box-shadow': '#dddddd -6px 0 6px -6px inset'
        })

        this.global.state.registryListener([
            Constants.events.EDIT_ELEMENT_WIDTH_CHANGE,
            Constants.events.EDIT_ELEMENT_HEIGHT_CHANGE,
            Constants.events.PAGE_WIDTH_CHANGE
        ], () => {
            let editwidth = global.editElement.getInfo().innerWidth;
            let pagewidth = global.page.getInfo().innerWidth;
            this.setStyle({height: global.editElement.getInfo().innerHeight + 'px'});
            if(editwidth >= pagewidth){
                this.disappear();
            }else{
                this.show();
            }
        });
    }

    scrollShow(){
        if(this.global.editElement.getInfo().innerWidth < this.global.page.getInfo().innerWidth){
            this.show();
        }
    }
}

export default class extends Element {
    rightShallow = undefined;

    constructor(global) {
        super(global.creatElemt('div'), global);
        global.editElement = this;
        this.setRole("EditElement");
        this.append(new Page(global));
        this.append(new ButtomScrollBar(global));
        this.rightShallow = new RightShallow(global);
        this.append(this.rightShallow);
        this.topShallow = new TopShallow(global);
        this.append(this.topShallow);

        this.setStyle({
            position: 'relative',
            overflow: 'hidden'
        });

        this.global.state.registryListener(Constants.events.EDITOR_SIZE_CHANGE, ()=>{
            let edtiroInfo = this.global.editor.getInfo();
            this.setWidth(edtiroInfo.innerWidth - 14);
            this.setHeight(edtiroInfo.innerHeight);
            this.rightShallow.setStyle({
                height: edtiroInfo.innerHeigth + 'px'
            });
            this.topShallow.setStyle({
                width: edtiroInfo.innerWidth + 'px'
            });
        })
    }

    setWidth(num){
        this.setStyle({width: num + 'px'});
        this.global.state.triggerEvent(Constants.events.EDIT_ELEMENT_WIDTH_CHANGE);
    }
    setHeight(num){
        this.setStyle({height: num + 'px'});
        this.global.state.triggerEvent(Constants.events.EDIT_ELEMENT_HEIGHT_CHANGE);
    }

}