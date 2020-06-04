import getWindow from 'get-window'
import Utils from './Utils';
import State from './State';

export default class {
    window = undefined;
    document = undefined;
    editor = undefined;
    editElement = undefined;
    page = undefined;
    buttomScrollBar = undefined;
    rightScrollBar = undefined;
    state = undefined;

    constructor(element){
        this.window = getWindow(element);
        this.document = this.window.document;
        this.state = new State();
        this.window.setInterval(()=>this.state.update(), 200);
    }

    creatElemt(name, obj){
        let element = this.document.createElement(name);
        if(Utils.isObject(obj)){
            for(let i in obj){
                element[i] = obj[i];
            }
        }
        return element;
    }
}