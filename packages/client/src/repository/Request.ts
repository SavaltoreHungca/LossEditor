import { FakeRequest as Repository } from './FakeRequest';
import { NodeCategory } from "./transferTypes";

export interface CallBack<T> {
    (status: "processing" | "ok" | 'failed', data: T): void
}

export interface Request {
    getNodeList(callback: CallBack<NodeCategory>): void;
    getNodeContent(id: string, callback: CallBack<any>): void; 
}

export var repository: Request = new Repository();