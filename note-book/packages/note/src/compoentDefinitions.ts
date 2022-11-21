import { isNil, Nil } from "./utils";
import { HtmlUtil } from "./utils/HtmlUtil";

export enum ComponentType {
    Div, Text, ScrollWin, EditablePage, Cursor, Paragraph, ParagraphLine, ParagraphUnit, DocCon, Table
}

export abstract class Component {
    public element: HTMLElement = Nil;
    public children: Array<Component> = [];
    public parent: Component = Nil;

    abstract get type(): ComponentType;
    

    constructor(element: HTMLElement) {
        this.element = element;
    }

    public destroy(): void {
        this.children.forEach(ite=>{
            ite.parent.removeChild(ite);
        })
    }

    public appendChild(component: Component) {
        if (component.element.parentElement) {
            component.element.parentElement.removeChild(component.element);
        }
        component.parent = this;
        this.element.appendChild(component.element);
        this.children.push(component)
        return this;
    }

    public removeChild(component: Component) {
        this.element.removeChild(component.element);
        component.parent = Nil;
        const index = this.children.indexOf(component);
        this.children.splice(index, 1);
        return this;
    }

    public setStyle(style: { [i: string]: string | number }) {
        HtmlUtil.setStyle(this.element, style);
        return this;
    }

    public addClass(clas: string){
        HtmlUtil.addClass(this.element, clas);
        return this;
    }

    public getInfo(){
        return HtmlUtil.getElementInfo(this.element);
    }
}

export class Div extends Component {
    get type() {
        return ComponentType.Div;
    }

    constructor() {
        super(document.createElement('div'));
    }
}

export interface TextStyle {
    color: string
    size: number
}

export class Text extends Component {
    get type() {
        return ComponentType.Text;
    }

    public textStyle: TextStyle = Nil;

    public setTextStyle(style: TextStyle ){
        this.textStyle = style;
        this.setStyle({
            color: style.color,
            'font-size': style.size + 'px'
        })
        return this;
    }

    constructor() {
        super(document.createElement('span'));
    }

    set innerText(text: string) {
        if (this.children.length > 0) {
            throw new Error('有子元素的组件不能设置文本');
        }
        this.element.innerHTML = text;
    }

    get innerText(): string {
        if (this.children.length > 0) {
            throw new Error('有子元素的组件不能存在文本');
        }
        return this.element.innerHTML || '';
    }

    public setInnerText(text: string){
        this.innerText = text;
        return this;
    }

    public split(pivot: number){
        return [
            new Text().setInnerText(this.innerText.substring(0, pivot)).setTextStyle(this.textStyle),
            this.setInnerText(this.innerText.substring(pivot))
        ]
    }

    public isEmpty(): boolean{
        return this.innerText === '' || isNil(this.innerText);
    }
}

export class Win {
    public static document = {
        setOnResize: ()=>{

        },
        body: {
            appendChild: (component: Component) => {
                document.body.appendChild(component.element);
            }
        }
    }

    static set onResize(callback: (this: Window, ev: UIEvent)=>void){
        window.addEventListener('resize', callback);
    }
}