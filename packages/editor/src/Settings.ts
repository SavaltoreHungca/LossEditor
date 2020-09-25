import { Nil } from 'utils';

export class Settings implements SettingRecevier {
    lazyInit = false
    container = Nil
    document = defaultDocument
    width = Nil
    height = Nil
}

export interface SettingRecevier {
    lazyInit?: boolean
    container?: HTMLElement
    document?: object | string
    width?: number
    height?: number
}

const defaultDocument = {
    type: 'root',
    sentinelAct: {
        placeholder: 'type something in here',
        style: {
            color: 'grey'
        }
    }
}