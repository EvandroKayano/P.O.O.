import { Bike } from "./bike";
import { User } from "./user";

export class Rent{
    constructor(
        public bike: Bike,
        public user: User,
        public dateFrom: Date,
        public dateTo: Date,
        public dateReturned?: Date
    ){}


    static create(rents: Rent[],bike: Bike, user: User, startDate: Date, endDate: Date): Rent{

        const canCreate = Rent.canRent(rents,startDate,endDate)

        // seu eu posso criar
        if(canCreate) return new Rent(bike,user,startDate,endDate)
        // posso deixar return na msm linha pra deixar entendivel

        // senão
        throw new Error('Overlaping dates.')

    }


    //retorna booleano, ta disponivel ou não
    static canRent(rents: Rent[],startDate: Date,endDate: Date): boolean {
        //.some = algum
        return !(rents.some(rent => {
            return startDate <= rent.dateTo && 
                   endDate >= rent.dateFrom
        })) 
    }

    // static canRent(rents: Rent[],startDate: Date,endDate: Date): boolean {
    //     for(const rent of rents){
    //         if(startDate <= rent.dateTo && endDate >= rent.dateFrom)
    //             return false
    //     }
    //     return true

    // }

}