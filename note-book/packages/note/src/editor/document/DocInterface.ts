import { DocTypes } from "./Doc";

export abstract class DocInterface {
    abstract get type(): DocTypes;
}
