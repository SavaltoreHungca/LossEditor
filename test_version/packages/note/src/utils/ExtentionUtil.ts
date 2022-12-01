export class ExtentionUtil {

    /**
     * 为对象挂载方法
     * @param ele 
     * @param extendFunctions 
     */
    mountMethod<T>(
        ele: T, 
        extendFunctions: Array<(ele: T) => { [index: string]: Function }>): T {
        for (const ex of extendFunctions) {
            const exts = ex(ele);
            for (const name in exts) {
                ele[name] = exts[name];
            }
        }
        return ele;
    }
}
