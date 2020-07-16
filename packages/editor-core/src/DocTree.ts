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

export class DocTree {
    root?: Node;
    selection?: Selection;
    regisdEvents = new Map<string, Array<Function>>();

    cursorMoveBehaviorSet = new Map<string, Function>();

    setTree(root: Node) {
        this.root = root;
        const stack = [root];
        this.triggleEvent('node_created', event => event(undefined, root));
        while (stack.length > 0) {
            const root = <Node>stack.shift();
            if (root.children) {
                root.children.forEach(child => {
                    this.triggleEvent('node_created', event => event(root, child));
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

    regisCursorMoveBehavior(nodeType: string, behavior: (cursorPoint: Point, offset: number, isHorizontal: boolean) => MoveCurosorResult) {
        this.cursorMoveBehaviorSet.set(nodeType, behavior);
    }

    moveCursorPosition(offset: number, isHorizontal: boolean): void {
        if (!this.selection) return;
        const { end } = this.selection;
        const newEndPoint = this.moveCursor({ ...end }, offset, isHorizontal);
        if (newEndPoint) {
            this.selection.end = newEndPoint;
            this.triggleEvent('selection_change', event => event(<Selection>this.selection));
        }
    }

    setSelection(selection: Selection){
        this.selection = selection;
        this.triggleEvent('selection_change', event => event(<Selection>this.selection));
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