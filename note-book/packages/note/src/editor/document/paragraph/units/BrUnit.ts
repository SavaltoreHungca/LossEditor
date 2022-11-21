import { UnitType, UnitDoc } from "./UnitDoc";


export class BrUnit extends UnitDoc {
    get type(): UnitType {
        return UnitType.br
    }
}