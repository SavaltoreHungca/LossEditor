import Utils from "./Utils";

export default class {
    updateList = [];
    registry(updateContextFunction, updateFunction){
        let context = updateContextFunction();
        this.updateList.push([context, updateContextFunction, updateFunction]);
        updateFunction(context);
    }
    update(){
        for(let item of this.updateList){
            let [context, updateContextFunction, updateFunction] = item;
            let newcontext = updateContextFunction();
            if(this.isContextNotEqual(context, newcontext)){
                item[0] = newcontext;
                updateFunction(newcontext);
            }
        }
    }
    isContextNotEqual(context_1, context_2){
        for(let name in context_1){
            if(context_1[name] !== context_2[name]){
                return true;
            }
        }
        if(Object.keys(context_1).length !== Object.keys(context_2).length){
            for(let name in context_2){
                if(context_1[name] !== context_2[name]){
                    return true;
                }
            }
        }
        return false;
    }
}