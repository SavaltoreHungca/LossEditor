import Global from './Global';
import EditElement from './EditElement';
import Element from './Element';
import Utils from './Utils';
import RightScrollBar from './RightScrollBar';
import Constants from './Constants';

export default class extends Element {
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
        if (Utils.isEmptyStr(width)) {
            this.setWidth(300);
        }
        if (Utils.isEmptyStr(height)) {
            this.setHeight(200);
        }

        this.global.state.registry(
            () => {
                let info = this.getInfo();
                let pageInfo = this.global.page.getInfo();
                return {
                    width: info.innerWidth, height: info.innerHeight,
                    pagewidth: pageInfo.innerWidth, pageheight: pageInfo.innerHeight
                }
            },
            () => {
                this.global.state.triggerEvent(Constants.events.EDITOR_SIZE_CHANGE);
            }
        )
        this.global.state.registry(
            () => {
                let pageInfo = this.global.page.getInfo();
                return {
                    pagewidth: pageInfo.innerWidth, pageheight: pageInfo.innerHeight
                }
            },
            () => {
                this.global.state.triggerEvent(Constants.events.PAGE_WIDTH_CHANGE);
                this.global.state.triggerEvent(Constants.events.PAGE_HEIGHT_CHANGE);
            }
        )
    }

    setWidth(num) {
        this.setStyle({ width: num + 'px' });
        this.global.state.triggerEvent(Constants.events.EDITOR_SIZE_CHANGE);
    }

    setHeight(num) {
        this.setStyle({ height: num + 'px' });
        this.global.state.triggerEvent(Constants.events.EDITOR_SIZE_CHANGE);
    }
}