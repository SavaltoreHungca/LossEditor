import { nodelist, editorcontent } from './../testdata';
import { Request, CallBack } from "./Request";
import { NodeList } from "../renderNodeList";

export class FakeRequest implements Request{
    getNodeList(callback: CallBack<NodeList>): void {
        callback('processing');
        window.setTimeout(()=>{
            callback('ok', nodelist);
        }, 500)
    }
    getNodeContent(id: string, callback: CallBack<any>): void {
        callback('processing');
        window.setTimeout(()=>{
            callback('ok', editorcontent);
        }, 500)
    }

}