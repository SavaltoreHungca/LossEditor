import uuid from 'uuid';

export var Nil = undefined as any;
export type NilType = null | undefined;
export function randmonId() {
    return "_" + uuid.v1().replace(/-/g, '');
}
export function anonyFunction(func: Function): string {
    const funcName = randmonId();
    window[funcName] = func;
    return funcName;
}
export function randomInt(len?: number) {
    if (typeof len !== 'number') {
        len = 100;
    }
    return Math.ceil(Math.random() * Math.pow(10, Math.ceil(len / 10))) % len;
}
export function randomAlphabetStr(len?: number) {
    if (typeof len !== 'number') {
        len = 6;
    }
    const set = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let ans = '';
    for (let i = 0; i < len; i++) {
        ans += set[randomInt(set.length)];
    }
    return ans;
}

export function randomEmoji(len?: number) {
    if (typeof len !== 'number') {
        len = 1;
    }
    const set = emojiList;
    let ans = '';
    for (let i = 0; i < len; i++) {
        ans += set[randomInt(set.length)];
    }
    return ans;
}

export function isNil(obj: any): obj is null | undefined {
    return obj === null || typeof obj === 'undefined'
}

export function forInObject(obj: Object, consumer: (k: string) => void) {
    if (!isNil(obj)) {
        Object.keys(obj).forEach(ite => {
            consumer(ite);
        })
    }
}

/**
* 从 from 到 to 每个数字间隔多少时间执行一次 consumer
* @param from 
* @param to 
* @param spendTime 
* @param eachTime 
* @param consumer
*/
export function step(
    from: number,
    to: number,
    spendTime: number,
    eachTime: number,
    consumer: (value: number) => void) {

    if (spendTime < eachTime) spendTime = eachTime;

    const times = spendTime / eachTime;
    const len = to - from;
    const step = len / times;

    let executedTimes = 0;
    const func = () => {
        from += step;
        executedTimes++;
        consumer(from);
        if (executedTimes < times) {
            window.setTimeout(() => func(), eachTime);
        }
    }

    func();
}

export function stackPeek<T>(stack: Array<T>): T {
    if (stack.length > 0) {
        return stack[stack.length - 1];
    }
    return Nil;
}


/**
 * 获取两个节点的共同祖先
 * @param n1 
 * @param n2 
 * @param getParent 获取父节点的方式
 * @param root 追溯至此则放弃
 */
export function getCommonAncestor<T>(n1: T, n2: T, getParent: (node: T) => T | NilType, root?: T): T | NilType {
    if (!n1 || !n2) return undefined;
    const parent = (node: T) => {
        const p = getParent(node);
        if (p) return p;
    }
    const n1Path = new Array<T>();
    let curN1: T = n1;
    do {
        if (curN1) n1Path.push(curN1);
        curN1 = <T>parent(curN1);
    } while (curN1 !== root);
    if (root) n1Path.push(root);
    while (n2) {
        for (let i = 0; i < n1Path.length; i++) {
            if (n2 === n1Path[i]) {
                return n2;
            }
        }
        n2 = <T>parent(n2);
    }
}

/**
 * 从 node 开始往上溯
 * @param node 
 * @param stage 0 代表 root
 * @param getParent 
 * @param isRoot 判断是否为root
 */
export function getRefStageNode<T>(
    node: T,
    stage: number,
    getParent: (node: T) => T | NilType,
    isRoot: (node: T | NilType) => boolean) {

    const path = new Array<T>();
    while (node && !isRoot(node)) {
        path.push(node);
        node = <T>getParent(node);
    }
    if (!isRoot(node)) return Nil;
    path.push(node);
    if (path.length > stage) {
        return path[path.length - 1 - stage];
    }
}

export function insertStrBefore(soure: string, start: number, newStr: string) {
    return soure.slice(0, start) + newStr + soure.slice(start);
}

/**
 * 查找 value 在那个范围中
 * sortedRanges 中的元素的第二位是指的偏移量
 * @param sortedRanges 排序好的范围列表
 */
export function findInWhichRange(sortedRanges: Array<[number, number]>, value: number): FoundRange {
    const ans: any = {
        foundRange: undefined,
        nearestNextRange: undefined,
        nearestPreRange: undefined
    }

    if (sortedRanges.length === 0) return ans;

    const inRange = (range: [number, number], value: number) => {
        return value >= range[0] && value < range[0] + range[1];
    }

    const inLeft = (range: [number, number], value: number) => {
        return value < range[0];
    }

    if (sortedRanges.length === 1) {
        if (inLeft(sortedRanges[0], value)) {
            ans.nearestNextRange = sortedRanges[0];
        } else if (inRange(sortedRanges[0], value)) {
            ans.foundRange = sortedRanges[0];
        } else {
            ans.nearestPreRange = sortedRanges[0];
        }
        return ans;
    }

    let critical = Math.floor(sortedRanges.length / 2);
    let preCritical = 0;

    while (critical !== preCritical) {
        if (inRange(sortedRanges[critical], value)) {
            ans.foundRange = sortedRanges[critical];
            ans.nearestNextRange = critical + 1 < sortedRanges.length ? sortedRanges[critical + 1] : undefined;
            ans.nearestPreRange = critical - 1 >= 0 ? sortedRanges[critical - 1] : undefined;
            return ans;
        }
        const curCritical = critical;
        const harf = Math.floor(Math.abs(preCritical - curCritical) / 2);

        if (inLeft(sortedRanges[critical], value)) {
            if (harf === 0) {
                if (critical > 0 && inRange(sortedRanges[critical - 1], value)) {
                    ans.foundRange = sortedRanges[critical - 1];
                    ans.nearestNextRange = critical < sortedRanges.length ? sortedRanges[critical] : undefined;
                    ans.nearestPreRange = critical - 2 >= 0 ? sortedRanges[critical - 2] : undefined;
                    return ans;
                } else {
                    if (critical > 0 && value < sortedRanges[critical - 1][0]) {
                        ans.nearestNextRange = sortedRanges[critical - 1];
                        ans.nearestPreRange = critical - 2 >= 0 ? sortedRanges[critical - 2] : undefined;
                    } else {
                        ans.nearestNextRange = sortedRanges[critical];
                        ans.nearestPreRange = critical - 1 >= 0 ? sortedRanges[critical - 1] : undefined;
                    }
                }
            } else {
                critical -= harf;
            }
        } else {
            if (harf === 0) {
                if (critical < sortedRanges.length - 1 && inRange(sortedRanges[critical + 1], value)) {
                    ans.foundRange = sortedRanges[critical + 1];
                    ans.nearestNextRange = critical + 2 < sortedRanges.length ? sortedRanges[critical + 2] : undefined;
                    ans.nearestPreRange = critical - 1 > 0 ? sortedRanges[critical - 1] : undefined;
                    return ans;
                } else {
                    ans.nearestNextRange = sortedRanges[critical + 1];
                    ans.nearestPreRange = critical >= 0 ? sortedRanges[critical] : undefined;
                }
            } else {
                critical += harf;
            }
        }

        preCritical = curCritical;
    }

    return ans;
}

const emojiList = [
    '😀', '😁', '😂', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '😗', '😙', '😚', '😇', '😐', '😑', '😶', '😏', '😣', '😥', '😮', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '😒', '😓', '😔', '😕', '😲', '😷', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😬', '😰', '😱', '😳', '😵', '😡', '😠',
    '👦', '👧', '👨', '👩', '👴', '👵', '👶', '👱', '👮', '👲', '👳', '👷', '👸', '💂', '🎅', '👰', '👼', '💆', '💇', '🙍', '🙎', '🙅', '🙆', '💁', '🙋', '🙇', '🙌', '🙏', '👤', '👥', '🚶', '🏃', '👯', '💃', '👫', '👬', '👭', '💏', '💑', '👪',
];

interface FoundRange {
    foundRange: [number, number] | NilType,
    nearestNextRange: [number, number] | NilType,
    nearestPreRange: [number, number] | NilType
}