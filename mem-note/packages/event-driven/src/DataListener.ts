export class DataListener {
    private contextList: Array<[any, Function, Function]> = new Array();

    constructor(interval: number) {
        setInterval(() => {
            for (const item of this.contextList) {
                const [context, contextFunc, callback] = item;
                const newcontext = contextFunc();
                item[0] = newcontext;
                if(!this.isContextEqual(context, newcontext)){
                    this.exectCallback(callback, newcontext);
                }
            }
        }, interval);
    }

    private exectCallback(callback: Function, context: any) {
        try {
            callback(context);
        } catch (e) {
            console.log("-----------数据监听器回调失败----------\n", e);
        }
    }

    private isContextEqual(context_1: any, context_2: any) {
        if (typeof context_1 === 'object' && context_1 !== null &&
            typeof context_2 === 'object' && context_2 !== null) {
            for (const key of Object.keys(context_1)) {
                if (context_1[key] !== context_2[key]) return false;
            }
            if (Object.keys(context_1).length !== Object.keys(context_2).length) {
                for (const key of Object.keys(context_2)) {
                    if (context_1[key] !== context_2[key]) return false;
                }
            }
            return true;
        } else if (Array.isArray(context_1) && Array.isArray(context_2)) {
            if (context_1.length !== context_2.length) return false;
            for (const index in context_1) {
                if (context_1[index] !== context_2[index]) return false;
            }
            return true;
        } else {
            return context_1 === context_2;
        }
    }

    addListener(contextFunc: Function, callBack: Function, firstExecCallback?: boolean) {
        const context = contextFunc();
        this.contextList.push([
            context,
            contextFunc,
            callBack
        ])
        if (firstExecCallback) this.exectCallback(callBack, context);
    }
}