import { Nil } from 'utils';

export class Settings implements SettingRecevier {
    container = Nil
    document = defaultDocument
    width = Nil
    height = Nil
}

export interface SettingRecevier {
    container: HTMLElement
    document?: object | string
    width: number
    height: number
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