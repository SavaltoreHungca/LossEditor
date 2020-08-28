import { Nil } from 'utils';

export class Settings implements SettingReceiver {
    container = Nil
    leftSidePadMinWidth = 200
    leftSidePadMaxWidth = 400
}

export interface SettingReceiver {
    container?: HTMLElement
    leftSidePadMinWidth?: number
    leftSidePadMaxWidth?: number
}