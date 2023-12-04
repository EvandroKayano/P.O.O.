import { Gps } from "./gps";

export class Bike {
    constructor(
        public name: string,
        public type: string,
        public bodySize: number,
        public maxLoad: number,
        public rate: number,
        public description: string,
        public ratings: number,
        public imageURL: string[],
        public available: boolean = true,
        public location: Gps = new Gps(0.0, 0.0),
        public id?: string
    ) {}
}