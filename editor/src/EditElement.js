import Element from "./Element";
import Page from './Page';
import ButtomScrollBar from './ButtomScrollBar';

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

        this.global.state.registry(
            () => {
                return {
                    editwidth: this.global.editElement.getInfo().innerWidth,
                    pagewidth: this.global.page.getInfo().innerWidth
                }
            },
            (context) => {
                if(context.editwidth >= context.pagewidth){
                    this.disappear();
                }else{
                    this.show();
                }
            }
        );
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

        this.global.state.registry(
            () => {
                let edtiroInfo = this.global.editor.getInfo();
                return {
                    editorwidth: edtiroInfo.innerWidth,
                    editorheight: edtiroInfo.innerHeight
                }
            },
            (context) => {
                this.setStyle({
                    width: context.editorwidth - 14 + 'px',
                    height: context.editorheight + 'px'
                });
                this.rightShallow.setStyle({
                    height: context.editorheight + 'px'
                });
                this.topShallow.setStyle({
                    width: context.editorwidth + 'px'
                });
            }
        );
    }
}