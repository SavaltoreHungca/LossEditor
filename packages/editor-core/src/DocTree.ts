import { Selection, Point } from "./Selection";
import { Node } from './Node';
import { Renderer, TextInputBehavior, EventTypes, BackSpaceBehavior, TypeSettingBehavior, EmptyOrgnizerNodeRnderBehavior, NodeCreator, WhenNodeBecomeEmptyBehavior, BehaviorTypes } from "./behaviorTypes";
import { Nil, ct, MapObj } from "utils";
import { DocTreeResolver } from "./DocTreeResolver";

export class DocTree {
    root: Node = Nil;
    selection: Selection = Nil;

    docTreeResolver: DocTreeResolver = Nil;
    nodeCreator: NodeCreator;
    regisdEvents = new Map<string, Array<Function>>();

    behaviorSet = {
        TextInputBehavior: new Map<string, TextInputBehavior>(),
        BackSpaceBehavior: new Map<string, BackSpaceBehavior>(),
        TypeSettingBehavior: new Map<string, TypeSettingBehavior>(),
        Renderer: new Map<string, Renderer>(),
        // 渲染节点时, 节点为空时的行为
        EmptyOrgnizerNodeRnderBehavior: new Map<string, EmptyOrgnizerNodeRnderBehavior>(),
        // 编辑文本时, 当前节点为空时的行为
        WhenNodeBecomeEmptyBehavior: new Map<string, WhenNodeBecomeEmptyBehavior>(),
    }

    constructor(nodeCreator: NodeCreator) {
        this.nodeCreator = nodeCreator;
    }

    setRoot(root: Node) {
        this.root = root;
        return this;
    }

    buildTree(doc: string | MapObj) {
        this.docTreeResolver = this.docTreeResolver || new DocTreeResolver(this);
        this.root = this.docTreeResolver.resolve(doc);
    }

    render(rootNode?: Node) {
        const startRender = (node: Node) => {
            const render = this.behaviorSet.Renderer.get(node.type);
            if (!render) throw new Error(`${node.type}的渲染器未注册`);
            render(node.parent, node);

            if (!node.isPresenter && (!node.children || node.children.length === 0)) {
                const behavior = this.behaviorSet.EmptyOrgnizerNodeRnderBehavior.get(node.type);
                if (behavior) {
                    behavior(node);
                }
            }
        }

        const root = rootNode ? rootNode : this.root;

        if (!root) return;

        const stack = [root];
        startRender(root);

        while (stack.length > 0) {
            const root = <Node>stack.shift();
            if (root.children) {
                root.children.forEach(child => {
                    startRender(child);
                    stack.push(child);
                });
            }
        }
    }

    triggleEvent<K extends keyof EventTypes>(id: K, triggle: (event: EventTypes[K]) => void) {
        const events = this.regisdEvents.get(id);
        if (events) {
            events.forEach(event => {
                triggle(<EventTypes[K]>event);
            })
        }
    }

    addEventListener<K extends keyof EventTypes>(name: K, listener: EventTypes[K]) {
        let events = this.regisdEvents.get(name);
        if (!events) {
            events = [];
            this.regisdEvents.set(name, events);
        }
        events.push(listener);
    }

    regisBehavior<K extends keyof BehaviorTypes>(nodeType: string, behaviorType: K, behavior: BehaviorTypes[K]) {
        this.behaviorSet[behaviorType].set(nodeType, ct(behavior));
    }

    backspace(selection?: Selection) {
        selection = selection ? selection : this.selection;
        if (!selection) return;

        if (selection.relativePostionStartEnd === 'OVERLAPPING') {
            let { end } = selection;
            end = <Point>end;
            const behavior = this.behaviorSet.BackSpaceBehavior.get(end.node.type);
            if (!behavior) throw new Error(`${end.node.type}的backspce行为未定义`);
            behavior(selection);
        }
    }

    typesetting(point: Point) {
        const behavior = this.behaviorSet.TypeSettingBehavior.get(point.node.type);
        if (!behavior) throw new Error(`${point.node.type}的排版行为未设定`);
        behavior(point);
    }

    changeSelection(start: Point, end: Point, pressEventTriggle?: boolean) {
        this.selection = new Selection(start, end);
        if (!pressEventTriggle) {
            this.triggleEvent('selection_change', event => event(this.selection));
        }
    }

    textInput(text: string) {
        if (!this.selection) return;
        if (!this.selection.end) return;
        const { end } = this.selection
        const behavior = this.behaviorSet.TextInputBehavior.get(end.node.type);
        if (!behavior) throw new Error(`${end.node.type}的输入行为未定义`);
        behavior(end, text);
    }

    nodeBecomeEmpty(node: Node) {
        const behavior = this.behaviorSet.WhenNodeBecomeEmptyBehavior.get(node.type);
        if (!behavior) throw new Error(`${node.type}的变空行为未设定`);
        behavior(node);
    }

    walkTree(consumer: (node: Node) => void) {
        if (!this.root) return;
        const stack = [this.root];
        while (stack.length > 0) {
            const root: Node = ct(stack.shift());
            consumer(root);
            const children = root.children;
            if (children) {
                children.forEach(child => {
                    stack.push(child);
                })
            }
        }
    }
}