import { Gps } from './gps'

export class Bike{
    constructor(
        public name: string,
        public type: string,
        public bodySize: number,
        public maxLoad: number,
        public hourly: number, // preço por hora
        public description: string,
        public ratings: number,
        public imageUrls: string[],
        public available: boolean = true, // vago para uso
        public local: Gps,
        public id?: string
        ){}

}