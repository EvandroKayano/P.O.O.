import { Bike } from "./bike";
import { Crypt } from "./crypt";
import { Rent } from "./rent";
import { User } from "./user";
import { Gps } from "./gps";

import { UserNotFoundError } from "./errors/user-not-found-error";
import { BikeNotFoundError } from "./errors/bike-not-found-error";
import { UnavailableBikeError } from "./errors/unavailable-bike-error";
import { DuplicatedUserError } from "./errors/duplicated-user-error";
import { UserRepo } from "./ports/user-repo";
import { BikeRepo } from "./ports/bike-repo";
import { RentRepo } from "./ports/rent-repo";
import { RentNotFoundError } from "./errors/rent-not-found-error";
import { UserWithOpenRentError } from "./errors/user-with-open-rent-error";

export class App {
    constructor(
        readonly userRepo: UserRepo,
        readonly bikeRepo: BikeRepo,
        readonly rentRepo: RentRepo
    ){}


    crypt: Crypt = new Crypt()

    // virou async e o find tb

    async findUser(email: string): Promise <User> {
        const user = await this.userRepo.find(email)
        if(!user) throw new UserNotFoundError()
        return user
    }

    async findBike(bikeId: string): Promise <Bike> {
        const bike = await this.bikeRepo.find(bikeId)
        if(!bike) throw new BikeNotFoundError()
        return bike
    }

//    findUnvailableRent(user:User): Rent{
//        // teste para ver se o user existe
//       const userTest = this.findUser(user.email)
//        //teste para ver se acha uma rent que não foi devolvida
//        for (const rRent of this.rents) {
//            if (rRent.user === user && rRent.bike.available == false) {
//                return rRent
//            }
//        }
//        throw new Error('User already retrived the bike.')
//    }


    async registerUser(user: User): Promise <string> {

        if ( await this.userRepo.find(user.email) ){
                throw new DuplicatedUserError()
        }

        const encryptedPassword = await this.crypt.encrypt(user.password)
        user.password = encryptedPassword
        return await this.userRepo.add(user)
    }


    async authenticate(userEmail: string, password: string): Promise <boolean> {
        const user = await this.findUser(userEmail)
        return await this.crypt.compare(password, user.password)
    }


    async registerBike(bike: Bike):Promise <string> {
        return await this.bikeRepo.add(bike)
    }


    async removeUser(email: string):Promise <void> {
        const openRent = await this.rentRepo.findOpenRentFor(email)
        // se achar um rent
        if (openRent.length == 0) { 
            await this.findUser(email)
            await this.userRepo.remove(email)
        }
        else{
            throw new UserWithOpenRentError()

        }
    }
    

    async rentBike(bikeId: string, userEmail: string):Promise <String> {
        const bike = await this.findBike(bikeId)
        if (!bike.available) { 
            throw new UnavailableBikeError()
        }
        const user = await this.findUser(userEmail)
        //bike.available = false
        await this.bikeRepo.updateAvailability(bikeId,false)
        const newRent = new Rent(bike, user, new Date())
        return await this.rentRepo.add(newRent)
    }


    async returnBike(bikeId: string, userEmail: string):Promise <number> {
        const now = new Date()
        const rent = await this.rentRepo.findOpen(bikeId,userEmail)
        if (!rent) throw new RentNotFoundError()
        rent.end = now
        await this.rentRepo.update(rent.id,rent)
        //rent.bike.available = true
        await this.bikeRepo.updateAvailability(rent.bike.id,true)
        const hours = diffHours(rent.end, rent.start)
        return hours * rent.bike.rate
    }



    async listUsers():Promise <User[]> {
        return await this.userRepo.list()
    }

    async listBikes():Promise <Bike[]> {
        return await this.bikeRepo.list()
    }



    async moveBikeTo(bikeId:string,place:Gps) {
        const bike = await this.findBike(bikeId)        
        //bike.latitude = place.lati
        //bike.longitude = place.long
        await this.bikeRepo.updateLocation(bikeId,place.lati,place.long)
    }


    async removeBike(bikeID: string) {
        // confere se existe essa bike
        const bike = await this.findBike(bikeID)
        // remove a bike
        await this.bikeRepo.remove(bikeID)
    }

}



function diffHours(dt2: Date, dt1: Date) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60);
  return Math.abs(diff);
}

// '1' == 1 , TRUE
// '1' === 1, FALSE

// const array = [1,2,3,-1]
// array.some( item => { return item < 0 } )
// algum numero no array negativo
// retorna TRUE

// array.every( item => { return item < 0 } )
// retorna FALSE , 'every'  ->  todos tem que ser negativos