import Constants from "./Constants";
import { Element } from "./other/Element";
import { Utils } from 'utils';

export default class extends Element {

    getType(){
        return "Window";
    }

    __init__() {

        // 水平滚动事件
        this.addEventListener('wheel', (e: WheelEvent) => {
            e.stopPropagation();
            e.preventDefault();

            if(e.deltaX === 0) return;

            let {
                page,
                buttomScrollBar,
                rightshallow,
                buttomSlider,
            } = this.global.getAll();

            const pageInfo = page.getInfo();
            const buttomScrollBarInfo = buttomScrollBar.getInfo();

            let offset = pageInfo.left - e.deltaX;
            if (buttomScrollBarInfo.innerWidth < pageInfo.innerWidth) {
                rightshallow.show();
            }
            if (buttomScrollBarInfo.innerWidth >= pageInfo.innerWidth || offset >= 0) {
                offset = 0;
            } else if (offset <= buttomScrollBarInfo.innerWidth - pageInfo.innerWidth) { // 到达右边极限
                offset = buttomScrollBarInfo.innerWidth - pageInfo.innerWidth;
                rightshallow.disappear();
            }

            page.setLeft(offset + 'px');
            buttomSlider.setLeft(-offset * buttomScrollBarInfo.innerWidth / pageInfo.innerWidth + 'px');
        })
        // 垂直滚动事件
        this.addEventListener('wheel', (e: WheelEvent)=>{
            e.stopPropagation();
            e.preventDefault();
            if(e.deltaY === 0) return;
            let {
                page,
                rightScrollBar,
                topshallow,
                rightSlider
            } = this.global.getAll();
            const pageInfo = page.getInfo();
            const rightScrollBarInfo = rightScrollBar.getInfo();

            let offset = pageInfo.top - e.deltaY;
            if(rightScrollBarInfo.innerHeight < pageInfo.innerHeight){
                topshallow.show();
            }
            if (rightScrollBarInfo.innerHeight >= pageInfo.innerHeight || offset >= 0) {
                offset = 0;
                topshallow.disappear();
            } else if (offset <= rightScrollBarInfo.innerHeight -  pageInfo.innerHeight) {
                offset = rightScrollBarInfo.innerHeight -  pageInfo.innerHeight;
            }

            page.setTop( offset + 'px');
            rightSlider.setTop(-offset * rightScrollBarInfo.innerHeight / pageInfo.innerHeight + 'px');
        })


        if (this.global.settings.bottomScrollBarInner) {
            // 底部滚动条自动消失
            this.addEventListener('wheel', (e: WheelEvent) => {
                if(e.deltaX === 0){
                    return;
                }
                const buttomScrollBar = this.global.get(Constants.objs.buttomScrollBar);
                buttomScrollBar.show();
                buttomScrollBar.disappear(1500);
            })

            // 移动到底部显示底部滚动条
            // this.addEventListener('mousemove', (e: MouseEvent) => {
            //     let {
            //         window,
            //         buttomScrollBar
            //     } = this.global.getAll();

            //     let { offsetY } = e;
            //     let windowInfo = window.getInfo();
            //     let buttomBarInfo = buttomScrollBar.getInfo();
            //     if (
            //         windowInfo.innerHeight - offsetY <= buttomBarInfo.height ||
            //         Utils.in(buttomScrollBar.getNative(), e['path'])
            //     ) {
            //         buttomScrollBar.show();
            //     } else {
            //         buttomScrollBar.disappear(1500);
            //     }
            // });

            // 离开停止显示底部滚动条
            this.addEventListener('mouseleave', () => {
                let {
                    buttomScrollBar
                } = this.global.getAll();
                buttomScrollBar.disappear(1500);
            })
        }
    }

}