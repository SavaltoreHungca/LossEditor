import Utils from "./Utils";

export default class {
    proxy = undefined;
    global = undefined;
    constructor(element, global) {
        this.proxy = element;
        this.global = global;
    }
    append(element) {
        this.proxy.append(element.proxy);
    }
    appendNative(native) {
        this.proxy.append(native);
    }
    focus() {
        this.proxy.focus();
    }
    setStyle(style) {
        Utils.setStyle(this.proxy, style);
    }
    getInlineCssStyle() {
        return Utils.getInlineCssStyle(this.proxy);
    }
    getCssStyle() {
        return this.proxy.style;
    }

    addEventListener(name, callback, option) {
        if (name === 'drag') {
            this.dragState = { pressed: false, registered: false }
            this.proxy.addEventListener('mousedown', (event) => {
                this.dragState.startX = event.screenX;
                this.dragState.startY = event.screenY;
                this.dragState.pressed = true;
            })

            let resizing = (event) => {
                if (this.dragState.pressed) {
                    this.dragState.deltaX =  event.screenX - this.dragState.startX;
                    this.dragState.deltaY =  event.screenY - this.dragState.startY;
                    this.dragState.startX += this.dragState.deltaX;
                    this.dragState.startY += this.dragState.deltaY;
                    callback(this.dragState);
                }
            };
            let resizeDone = (event) => {
                this.dragState.pressed = false;
                this.dragState.registered = false;
                this.global.document.removeEventListener('mousemove', resizing);
                this.global.document.removeEventListener('mouseup', resizeDone);
                Utils.setStyle(this.global.document.body, {"user-select": ""});
                callback(this.dragState);
            };
            this.proxy.addEventListener('mousemove', (event) => {
                if (this.dragState.pressed && !this.dragState.registered){
                    this.dragState.registered = true;
                    Utils.setStyle(this.global.document.body, {"user-select": "none"});
                    this.global.document.addEventListener('mousemove', resizing);
                    this.global.document.addEventListener('mouseup', resizeDone);
                }
            })
            return;
        }
        this.proxy.addEventListener(name, callback, option);
    }
    getInfo() {
        return Utils.getElementInfo(this.proxy);
    }
    show() {
        this.setStyle({ visibility: 'visible' });
    }

    cancelDisappear(){
        for (let i of this.disappearIds) {
            this.global.window.clearTimeout(i);
        }
    }

    disappearIds = [];
    disappear(delay) {
        if (delay) {
            this.cancelDisappear();
            let id = this.global.window.setTimeout(() => { this.setStyle({ visibility: 'hidden' }) }, delay);
            this.disappearIds.push(id);
        } else {
            this.setStyle({ visibility: 'hidden' });
        }
    }

    cancelLastTimeout(id){
        let ids = this.timeoutIdMap.get(id);
        if(Utils.isArray(ids)){
            for(let i of ids){
                this.global.window.clearTimeout(i);
            }
        }
    }

    timeoutIdMap = new Map();
    setLastTimeout(id, func, delay){
        let ids = this.timeoutIdMap.get(id);
        if(!Utils.isArray(ids)){
            ids = [];
            this.timeoutIdMap.set(id, ids);
        }
        this.cancelLastTimeout(id);
        ids.push(this.global.window.setTimeout(func, delay));
    }

    setRole(roleName){
        this.proxy.setAttribute("data-role", roleName);
    }
}