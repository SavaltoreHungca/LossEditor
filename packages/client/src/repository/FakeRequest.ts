import { NodeCategory } from './transferTypes';
import { Request, CallBack } from "./Request";
import { $$, Nil } from 'utils';


export class FakeRequest implements Request {
    getNodeList(callback: CallBack<NodeCategory>): void {
        callback('processing', Nil);
        window.setTimeout(() => {
            callback('ok', nodelist);
        }, 500)
    }
    getNodeContent(id: string, callback: CallBack<any>): void {
        callback('processing', Nil);
        window.setTimeout(() => {
            callback('ok', editorcontent);
        }, 500)
    }
}

const nodelist = [
    {
        title: '我的笔记',
        id: $$.randmonId(),
        tag: '临时',
        children: [
            {
                title: '读书随记',
                id: $$.randmonId(),
                tag: '随记'
            }
        ]
    }
]
const editorcontent = {
    type: 'root',
    sentinelAct: {
        placeholder: 'type something in here',
        style: {
            color: 'grey'
        }
    },
}