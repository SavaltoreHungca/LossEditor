import { Constants } from './../Constants';
import { MemLoss } from './../MemLoss';
import { repository } from '../repository/Request';


export function initializeData(memloss: MemLoss) {
    memloss.eventManager.bindEventOn(Constants.events.UI_INITIALIZED, () => {
        const { leftSidePad } = memloss

        repository.getNodeList((status, data) => {
            switch (status) {
                case 'processing':
                    break;
                case 'ok':
                    leftSidePad.nodeListPad.renderNodeList(data); break;
                case 'failed':
                    break;
            }
        })

    })
}