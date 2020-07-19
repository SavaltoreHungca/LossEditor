export class BidMap<K, V> {
    private keyMap = new Map<K, V>()
    private valueMap = new Map<V, K>()

    getvalue(k: K) {
        return <V>this.keyMap.get(k);
    }

    getkey(v: V){
        return <K>this.valueMap.get(v);
    }

    set(k: K, v: V){
        this.keyMap.set(k, v);
        this.valueMap.set(v, k);
    }
}