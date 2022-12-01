
export enum UnitType {
    text, br
}

export abstract class UnitDoc {
    abstract get type(): UnitType;
}