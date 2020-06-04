
export default class {
    static setStyle(element, style){
        let getCssText = (style)=>{
            let ans = "";
            if(!this.isObject(style)) return "";
            for(let name in style){
                ans += name + ':' + style[name] + ';';
            }
            return ans;
        }

        let getCssStyle = (cssText)=>{
            if(cssText){
                let ans = {};
                let styles = cssText.split(';').filter(Boolean);
                for(let style of styles){
                    let [name, value] = style.split(':');
                    ans[name] = value;
                }
                return ans;
            }
        }

        if(element.style.cssText){
            let beforeStyle = getCssStyle(element.style.cssText)
            for(let name in style){
                if(style[name] === ""){
                    delete beforeStyle[name];
                }else{
                    beforeStyle[name] = style[name];
                }
            }
            element.style.cssText = getCssText(beforeStyle);
        }else{
            if(!this.isObject(style)) return;
            element.style.cssText = getCssText(style)
        }
    }

    static getInlineCssStyle(element){
        let cssText = element.style.cssText;
        if(cssText){
            let ans = {};
            let styles = cssText.split(';').filter(Boolean);
            for(let style of styles){
                let [name, value] = style.split(':');
                ans[name] = value;
            }
            return ans;
        }
    }

    static getElementInfo(element){
        let ans = {};
        ans.width = element.offsetWidth;
        ans.height = element.offsetHeight;
        ans.top = element.offsetTop;
        ans.left = element.offsetLeft;
        ans.innerWidth = ans.width;
        if(element.style.borderLeftWidth){
            ans.innerWidth -= parseInt(element.style.borderLeftWidth.substring(0, 1));
        }
        if(element.style.borderRightWidth){
            ans.innerWidth -= parseInt(element.style.borderRightWidth.substring(0, 1));
        }
        ans.innerHeight = ans.height;
        if(element.style.borderTopWidth){
            ans.innerHeight -= parseInt(element.style.borderTopWidth.substring(0, 1));
        }
        if(element.style.borderBottomWidth){
            ans.innerHeight -= parseInt(element.style.borderBottomWidth.substring(0, 1));
        }
        return ans;
    }

    static isObject(obj){
        return !this.isUndfined(obj) && typeof obj === 'object';
    }

    static isEmptyStr(str){
        return str === "" || this.isUndfined(str);
    }

    static isUndfined(obj){
        return obj === null || typeof obj === 'undefined';
    }

    static isArray(obj){
        return Array.isArray(obj);
    }

    static isFunction(f){
        return typeof f === 'function';
    }

    static in(obj, array){
        if(this.isObject(array)){
            for(let item of array){
                if(obj === item){
                    return true;
                }
            }
        }
        return false;
    }
}