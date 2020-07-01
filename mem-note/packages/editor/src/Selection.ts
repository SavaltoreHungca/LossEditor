export interface Point {
    offset: number;
    node: HTMLElement;
}

export class Selection{
    private start: Point | undefined;
    private end: Point | undefined;
    private isCollapsed: boolean | undefined;
    private ancestor: Point | undefined;

    setSelection(start: Point, end: Point){
        

        this.start = start;
        this.end = end;
    }
}