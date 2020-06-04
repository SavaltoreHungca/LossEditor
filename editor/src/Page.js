import Element from "./Element";
import Utils from "./Utils";

export default class extends Element {
    snippet = undefined;

    constructor(global) {
        super(global.creatElemt('div'), global);
        this.global.page = this;
        this.setRole("Page");

        this.setStyle({
            position: 'absolute', width: '100%', "min-width": '500px',
            height: '1e+06px', contain: 'strict', overflow: 'hidden'
        })

        this.loadFromObject({
            name: "Snippet",
            children: [
                {
                    name: "InlinePayload",
                    content: [
                        {
                            name: "text",
                            data: "obj.parent.proxy, elemtNative, this.global obj.parent.proxy, elemtNative, this.globalobj.parent.proxy, elemtNative, this.globalobj.parent.proxy, elemtNative, this.global"
                        },
                        {
                            name: "emoji",
                            data: "/xixi"
                        },
                        {
                            name: "image",
                            data: "http://bushi.jpg"
                        }
                    ]
                }
            ]
        });
        console.log(this.snippet);
    }

    loadFromObject(obj) {
        let stack = [obj];
        let first = true;
        while (stack.length > 0) {
            obj = stack.shift();

            let name = obj.name;
            let Compnoent = this.global.editor.pageelements.get(name);
            let elemt = new Compnoent();
            let elemtNative = elemt.render(obj);
            elemtNative.setAttribute("data-role", name);

            elemt.proxy = elemtNative;
            elemt.proxy.__editor_type__ = elemt;
            elemt.name = name;

            if (!Utils.isUndfined(obj.content)){
                elemt.appendContent(elemtNative, this.global, obj.content);
            }
            if (!Utils.isUndfined(obj.children)) {
                obj.parent.appendChild(obj.parent.proxy, elemtNative, this.global);
            }

            if (Utils.isArray(obj.children)) {
                for (let item of obj.children) {
                    item.parent = elemt;
                    stack.push(item);
                }
            }

            if (first) {
                first = false;
                this.snippet = elemt;
            }
        }
        this.append(this.snippet);
    }

}