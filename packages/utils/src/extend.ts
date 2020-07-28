export function extend<T extends Element>(ele: HTMLElement | Element, extendFunctions: Array<(ele: HTMLElement) => Object>): T {
    for (const ex of extendFunctions) {
        const exts = ex(<HTMLElement>ele);
        for (const name in exts) {
            ele[name] = exts[name];
        }
    }
    return <T>ele;
}
