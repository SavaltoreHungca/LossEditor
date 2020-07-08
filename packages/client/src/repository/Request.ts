import { NodeList } from "../renderNodeList";
import { FakeRequest as Repository } from './FakeRequest';

export interface CallBack<T> {
    (status: "processing" | "ok" | 'failed', data?: T): void
}

export interface Request {
    getNodeList(callback: CallBack<NodeList>): void;
    getNodeContent(id: string, callback: CallBack<any>): void; 
}

export var repository: Request = new Repository();