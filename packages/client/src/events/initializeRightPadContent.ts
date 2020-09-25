import { Constants } from './../Constants';
import { MemLoss } from './../MemLoss';
import { repository } from '../repository/Request';


export function initializeRightPadContent(memloss: MemLoss) {
    memloss.eventManager.bindEventOn(Constants.events.UI_INITIALIZED, () => {
        const { rightSidePad } = memloss
        rightSidePad.switchPad('notePad');
        rightSidePad.notePad.openTab({id: 'shi', name: '我是名字很长的一页啊啊啊啊啊啊啊', content: ''});
        rightSidePad.notePad.openTab({id: 'shi', name: '我们的开始是漫长的电影', content: ''});
        // for(let i=0; i<100; i++){
        //     rightSidePad.notePad.openTab({id: 'shi', name: '我的笔记'}, ()=>{});
        // }
        window['shitbag'] = rightSidePad;
    })
}