export function extend(ele: any, extendFunctions: Array<(ele: any) => Object>): any {
    for (const ex of extendFunctions) {
        const exts = ex(ele);
        for (const name in exts) {
            ele[name] = exts[name];
        }
    }
    return ele;
}
