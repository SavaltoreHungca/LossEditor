import { Nil } from '../../utils';
import { Component, ComponentType } from '../../compoentDefinitions';
import { styleClasses } from '../..';

export class ScrollWin extends Component {

    get type() {
        return ComponentType.ScrollWin;
    }

    set onScroll(listener: () => void,) {
        this.element.addEventListener('scroll', (ev: Event) => {
            console.log(ev);
            listener();
        });
    }

    /**
     * 
     * @param content 滚动窗口的内容
     * @param width 
     * @param height 
     */
    constructor(content: Component, width: number, height: number) {
        super(document.createElement('div'));

        this.setStyle({
            position: 'relative',
            overflow: 'scroll',
            width: width,
            height: height,
        })
            .addClass(styleClasses.noScrollBar)
            .appendChild(content);

    }


}