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
            callback('ok', editorcontent());
        }, 500)
    }
}

const nodeitem = function () {
    return {
        title: `${$$.randomAlphabetStr()}`,
        id: $$.randmonId(),
        tag: `${$$.randomEmoji()}`,
        children: [
            {
                title: `${$$.randomAlphabetStr()}`,
                id: $$.randmonId(),
                tag: `${$$.randomEmoji()}`,
                children: [
                    {
                        title: `${$$.randomAlphabetStr()}`,
                        id: $$.randmonId(),
                        tag: `${$$.randomEmoji()}`,
                    }
                ]
            },
            {
                title: `${$$.randomAlphabetStr()}`,
                id: $$.randmonId(),
                tag: `${$$.randomEmoji()}`,
            }
        ]
    }
}
const nodelist: any = [];
for (let i = 0; i < 100; i++) {
    nodelist.push(nodeitem());
}

const editorcontent = function () {
    return {
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
                str: `${$$.randomAlphabetStr(100)}`
            }
        }]
    }
}