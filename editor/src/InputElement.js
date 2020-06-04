import Element from './Element'
import Utils from './Utils';

export default class extends Element{
    inputSate = undefined; // 记录输入状态
    inputText = undefined; // 用户输入的内容
    onInput = ()=>{console.log(this.inputText)}

    constructor(global){
        super(global.creatElemt('textarea'), global);
        // Utils.setStyle(this.proxy, { position: 'absolute', width: "0", height: "0", margin: "0", padding: "0", outline: "none", border: "none", overflow: "hidden" })
        this.addEventListener("compositionstart", (e)=>{
            this.inputSate = "compositionstart";
        })
        this.addEventListener("input", (e)=>{
            if(Utils.isUndfined(this.inputSate) && !Utils.isEmptyStr(e.data)){
                this.inputText = e.data;
                e.target.value = "";
                this.onInput();
                return;
            }
        })
        this.addEventListener("compositionend", (e)=>{
            this.inputSate = 'compositionend'
            this.inputText = e.data;
            this.inputSate = undefined;
            e.target.value = "";
            this.onInput();
        })
    }
}