import { Selection, Point } from "./Selection";
import { Node } from './Node';

declare type EventTypes = {
    node_created: (parent: Node | undefined, child: Node) => void
    selection_change: (selection: Selection) => void
}

export type MoveCurosorResult = {
    isExceed: boolean
    offset: number
}

export type SetSelectionResult = {
    pointType: 'start' | 'end'
    offset: number
}

export class DocTree {
    root?: Node;
    selection?: Selection;


    regisdEvents = new Map<string, Array<Function>>();
    cursorMoveBehaviorSet = new Map<string, Function>();
    setSelectionBehaviorSet = new Map<string, Function>();
    textInputBehaviorSet = new Map<string, Function>();
    regisdRenderer = new Map<string, Function>();

    setRoot(root: Node) {
        this.root = root;
        return this;
    }

    render(rootNode?: Node) {
        const startRender = (node: Node) => {
            const render = this.regisdRenderer.get(node.type);
            if (!render) throw new Error(`${node.type}的渲染器未注册`);
            render(node.parent, node);

            if (!node.isPresenter && !node.children) {
                const sentinel = new Node('sentinel', true);
                node.children = [sentinel];
                sentinel.parent = node;
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

    regisSetSelectionBehavior<T>(nodeType: string, behavior: (node: Node, data: T) => SetSelectionResult | undefined) {
        this.setSelectionBehaviorSet.set(nodeType, behavior);
    }

    regisRenderer(nodeType: string, renderer: (parent: Node | undefined, node: Node) => void) {
        this.regisdRenderer.set(nodeType, renderer);
    }

    regisCursorMoveBehavior(nodeType: string, behavior: (cursorPoint: Point, offset: number, isHorizontal: boolean) => MoveCurosorResult) {
        this.cursorMoveBehaviorSet.set(nodeType, behavior);
    }

    regisTextInputBehavior(nodeType: string, behavior: (point: Point, text: string) => void) {
        this.textInputBehaviorSet.set(nodeType, behavior);
    }

    moveCursorPosition(offset: number, isHorizontal: boolean): void {
        if (!this.selection) return;
        const { end } = this.selection;
        if (!end) return;
        const newEndPoint = this.moveCursor({ ...end }, offset, isHorizontal);
        if (newEndPoint) {
            this.selection.end = newEndPoint;
            this.triggleEvent('selection_change', event => event(<Selection>this.selection));
        }
    }

    tmpSelection?: Selection
    setSelection<T>(node: Node, data: T) {
        const behavior = this.setSelectionBehaviorSet.get(node.type);
        if (!behavior) throw new Error(`${node.type}的setSelection行为未设置`);
        const setSelectionResult = <SetSelectionResult>behavior(node, data);
        if (!setSelectionResult) return;
        switch (setSelectionResult.pointType) {
            case 'start': {
                this.tmpSelection = new Selection({
                    node: node,
                    offset: setSelectionResult.offset
                })
                break;
            }
            case 'end': {
                if (!this.tmpSelection) return;
                this.tmpSelection.end = {
                    node: node,
                    offset: setSelectionResult.offset
                }
                this.selection = this.tmpSelection;
                this.triggleEvent('selection_change', event => event(<Selection>this.selection));
                break;
            }
        }
    }

    changeSelection(start: Point, end: Point, pressEventTriggle?: boolean) {
        this.selection = new Selection(start, end);
        if (!pressEventTriggle) {
            this.triggleEvent('selection_change', event => event(<Selection>this.selection));
        }
    }

    textInput(text: string) {
        if (!this.selection) return;
        if (!this.selection.end) return;
        const { end } = this.selection
        const behavior = this.textInputBehaviorSet.get(end.node.type);
        if (!behavior) throw new Error(`${end.node.type}的输入行为未定义`);
        behavior(end, text);
    }

    walkTree(consumer: (node: Node) => void) {
        if (!this.root) return;
        const stack = [this.root];
        while (stack.length > 0) {
            const root = <Node>stack.shift();
            consumer(root);
            const children = root.children;
            if (children) {
                children.forEach(child => {
                    stack.push(child);
                })
            }
        }
    }

    moveCursor(cursorPoint: Point, offset: number, isHorizontal: boolean): Point | undefined {
        const behavior = this.cursorMoveBehaviorSet.get(cursorPoint.node.type);

        if (!behavior) throw new Error(`${cursorPoint.node.type}的光标行为未注册`);

        const result: MoveCurosorResult = behavior(cursorPoint);

        if (result.isExceed) {
            const { node } = cursorPoint;
            if (result.offset > 0) {
                const nextPresenter = node.nextPresenter
                if (nextPresenter) {
                    return this.moveCursor({
                        node: nextPresenter,
                        offset: 0
                    }, result.offset, isHorizontal);
                }
            } else {
                const prePresenter = node.prePresenter;
                if (prePresenter) {
                    return this.moveCursor({
                        node: prePresenter,
                        offset: Number.MAX_VALUE
                    }, result.offset, isHorizontal)
                }
            }
        } else {
            cursorPoint.offset = result.offset;
            return cursorPoint;
        }
    }
}