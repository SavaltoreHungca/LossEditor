import { Constants } from './../Constants';
import { MemLoss } from './../MemLoss';
import { repository } from '../repository/Request';


export function initializeRightPadContent(memloss: MemLoss) {
    memloss.eventManager.bindEventOn(Constants.events.UI_INITIALIZED, () => {
        const { rightSidePad } = memloss
        rightSidePad.switchPad('notePad');
        rightSidePad.notePad.openTab({id: 'shi', name: 'sdjfik'}, ()=>{});
        rightSidePad.notePad.openTab({id: 'shi', name: '稀巴'}, ()=>{});
    })
}