import Global from './Global';
import EditElement from './EditElement';
import Element from './Element';
import Utils from './Utils';
import RightScrollBar from './RightScrollBar';

export default class extends Element{

    constructor(element) {
        super(element, new Global(element));
        this.global.editor = this;
        this.setRole("Editor");
        this.append(new EditElement(this.global));
        this.append(new RightScrollBar(this.global));

        this.setStyle({
            position: 'relative',
            border: '1px solid #eee',
            overflow: 'hidden'
        });
        let { width, height } = this.getCssStyle();
        if (Utils.isEmptyStr(width) ) {
            this.setStyle({ width: '300px' })
        }
        if(Utils.isEmptyStr(height)){
            this.setStyle({ height: '200px' })
        }
    }
}