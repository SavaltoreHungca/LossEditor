export class TimeUtil {
    private static timeoutIdMap: Map<String, Array<number>> = new Map();

    static cancelLastTimeout(id: string) {
        let ids = this.timeoutIdMap.get(id) || [];
        for (let i of ids) {
            clearTimeout(i);
        }
        this.timeoutIdMap.delete(id);
    }

    static setLastTimeout(id: string, func: ()=>void, delay: number) {
        this.cancelLastTimeout(id);
        let ids = this.timeoutIdMap.get(id);
        if (!ids) {
            ids = [];
            this.timeoutIdMap.set(id, ids);
        }
        ids.push(window.setTimeout(func, delay));
    }
}