import { Constants } from './../Constants';
import { MemLoss } from './../MemLoss';
import { repository } from '../repository/Request';


export function initializeLeftPadContent(memloss: MemLoss) {
    memloss.eventManager.bindEventOn(Constants.events.UI_INITIALIZED, () => {
        const { leftSidePad } = memloss
        leftSidePad.leftDirectoryTree.switchPad('nodeListPad');
    })
}