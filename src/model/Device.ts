import {Identifiable} from "./Identifiable";

export interface Device extends Identifiable{
    name: string;
    description: string;
    type: number;
    file: string;
}