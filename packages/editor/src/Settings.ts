import { Nil } from 'utils';

export class Settings implements SettingRecevier {
    container = Nil
    document = defaultDocument
}

export interface SettingRecevier {
    container: HTMLElement
    document?: object | string
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