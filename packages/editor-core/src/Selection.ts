import { Node } from './Node'
import { $$ } from 'utils';

export interface Point {
    node: Node
    offset: number
}

export class Selection {
    start?: Point
    end?: Point

    constructor(start?: Point, end?: Point) {
        this.start = start;
        this.end = end;
    }

    get isCollapsed(): boolean {
        return this.start?.node === this.end?.node
            && this.start?.offset === this.end?.offset;
    }

    get startSecondParent() {
        return $$.getRefStageNode(this.start?.node, 1, node => node?.parent, node => node?.type === 'root');
    }

    get endSecondParent() {
        return $$.getRefStageNode(this.end?.node, 1, node => node?.parent, node => node?.type === 'root');
    }

    get ancestor(): Node | undefined {
        return $$.getCommonAncestor(this.start?.node, this.end?.node, node => node?.parent);
    }

    get relativePostionStartEnd(): "START_IN_RIGHT" | "START_IN_LEFT" | "OVERLAPPING" {
        let startSecondParent = this.startSecondParent;
        let endSecondParent = this.endSecondParent;
        if (startSecondParent === endSecondParent) return 'OVERLAPPING';
        while (startSecondParent?.nextSibling) {
            startSecondParent = startSecondParent.nextSibling
            if (startSecondParent === endSecondParent) {
                return 'START_IN_LEFT';
            }
        }
        return 'START_IN_RIGHT';
    }

    get leftAndRight(): { left: Point, right: Point } {
        if (!this.end || !this.start) throw new Error();
        let left = this.end;
        let right = this.start;
        const relative = this.relativePostionStartEnd;
        if (relative === 'OVERLAPPING' && this.end.offset > this.start.offset) {
            left = this.start;
            right = this.end;
        } else if (relative === 'START_IN_LEFT') {
            left = this.start;
            right = this.end;
        }
        return {
            left: left,
            right: right
        };
    }
}