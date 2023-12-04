import { Rent } from "../../src/rent";
import { RentRepo } from "../../src/ports/rent-repo";
import crypto from 'crypto'


export class FakeRentRepo implements RentRepo{
    rents:Rent[] = []

    async add(rent:Rent): Promise <string>{
        const newId = crypto.randomUUID()
        rent.id = newId
        this.rents.push(rent)
        return newId
    }

    async find(id:String): Promise <Rent>{
        return this.rents.find(rent => rent.id === id)
    }


    async findOpen(bikeId:string,userEmail:string):Promise <Rent>{
        return this.rents.find(rent =>
            rent.bike.id === bikeId &&
            rent.user.email === userEmail &&
            !rent.end
        )
    }

    async findOpenRentFor(email:string): Promise <Rent[]>{
        const openRent = this.rents.filter(x=> x.user.email === email && !x.end)
        //se o user estiver cadastrado e tiver um rent ainda (não tem data de retorno da bike)
        // x.end == undefined

        return openRent

        //se achar, ele retorna um Rent, senão undefined
    }

    async updateEnd(id:String, end:Date): Promise<void>{
        const rentIndex = this.rents.findIndex(rent => rent.id === id)
        if (rentIndex !== -1) this.rents[rentIndex].end = end
    }

    async list():Promise<Rent[]>{
        return this.rents        
    }


}