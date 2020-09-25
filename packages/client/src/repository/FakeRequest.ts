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

const nodeitem = {
    title: '我的笔记',
    id: $$.randmonId(),
    tag: '😄',
    children: [
        {
            title: '读书随记',
            id: $$.randmonId(),
            tag: '随记',
            children: [
                {
                    title: '读书随记',
                    id: $$.randmonId(),
                    tag: '随记'
                }
            ]
        },
        {
            title: '读书随记',
            id: $$.randmonId(),
            tag: '随记'
        }
    ]
}
const nodelist: any = [];
for(let i = 0; i< 100; i++){
    nodelist.push(nodeitem);
}

const editorcontent = {
    type: 'root',
    sentinelAct: {
        placeholder: 'type something in here',
        style: {
            color: 'grey'
        }
    },
    children: [{
        type: 'paragraph',
        content: {
            str: '如果说你是海上的花火,我是兰花的泡沫,这一刻你照亮了我'
        }
    }]
}