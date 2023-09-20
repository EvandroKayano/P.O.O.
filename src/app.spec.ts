import sinon from "sinon"
import { App } from "./app"
import { Bike } from "./bike"
import { Gps } from "./gps"
import { User } from "./user"
import { UserNotFoundError } from "../errors/user-not-found-error"
import { BikeNotFoundError } from "../errors/bike-not-found-error"
import { DuplicatedUserError } from "../errors/duplicated-user-error"



describe('app', () => {
    it('should correctly calculate the rent amount', async() => {
        const app = new App()
        const User101 = new User('Joao','j@unifesp.br','1234')
        await app.registerUser(User101)
        const local = new Gps(0.0 , 0.0)
        const bici = new Bike('Caloi','Street',100,2, 100 ,'BEST SELLER!!!', 9.5,[],true,local,)
        app.registerBike(bici)

        const clock = sinon.useFakeTimers();

        app.rentBike(bici.id,User101.email)

        const hour = 1000* 60 * 60
        clock.tick(2 * hour)

        const rentAmount = app.returnBike(bici.id,User101.email)
        expect(rentAmount).toEqual(200.0)
    })

    it('should be able to move a bike to a specific location', async() => {
        const app = new App()
        const User101 = new User('Joao','j@unifesp.br','1234')
        await app.registerUser(User101)
        const bici = new Bike('Caloi','Street',100,2, 50 ,'BEST SELLER!!!', 9.5,[],true,)
        app.registerBike(bici)

        const NY = new Gps(40.753056, -73.983056)
        app.moveBikeTo(bici.id,NY)
        expect(bici.location.lati).toEqual(NY.lati)
        expect(bici.location.long).toEqual(NY.long)
    })



    it('should throw an expection when trying to move an unregistered', () => {
        const app = new App()
        // não precisa declarar uma bike
        const bike = new Bike('Caloi','Street',100,2, 50 ,'BEST SELLER!!!', 9.5,[],true,)
        const NY = new Gps(40.753056, -73.983056) 
        //não é boa prática
        expect( () => {(app.moveBikeTo(bike.id,NY))}).toThrow(BikeNotFoundError)
        // BikeNotFoundError nova class que é representa ERROR
        // EXPECT FOI USADO DE MANEIRA DIFERENTE
    })

    it('should correctly handle a bike rent', async () => {
        const app = new App()
        const User101 = new User('Joao','j@unifesp.br','1234')
        await app.registerUser(User101)
        const bike = new Bike('Caloi','Street',100,2, 100 ,'BEST SELLER!!!', 9.5,[],true,)
        app.registerBike(bike)
        app.rentBike(bike.id,User101.email)

        expect(app.rents.length).toEqual(1)
        expect(app.rents[0].bike.id).toEqual(bike.id)
        expect(app.rents[0].user.email).toEqual(User101.email)
        expect(app.rents[0].bike.available).toBeFalsy()
    })

    it('should throw unavailable bike when trying to rent with an unavailable bike', async () => {
        const app = new App()
        const User101 = new User('Joao','j@unifesp.br','1234')
        await app.registerUser(User101)
        const bike = new Bike('Caloi','Street',100,2, 100 ,'BEST SELLER!!!', 9.5,[],true,)
        app.registerBike(bike)
        app.rentBike(bike.id,User101.email)

        expect(() => { app.rentBike(bike.id,User101.email) }).toThrow('Unavailable bike.')
    })

    it('should throw user not found error when user is not found',() => {
        const app = new App()
        expect(() => { app.findUser('fake@email.com') }).toThrow(UserNotFoundError)
    })

    it('should throw user duplicated when registering a resgistered user', async() =>{ 
        const app = new App()
        const User101 = new User('Joao','j@unifesp.br','1234')
        await app.registerUser(User101)
        await expect(app.registerUser(User101) ).rejects.toThrow(DuplicatedUserError)
    })
    
    it('should throw False when autenticating a user with a wrong password', async() => {
        const app = new App()
        const User101 = new User('Joao','j@unifesp.br','1234')
        await app.registerUser(User101)

        await expect(app.authenticate(User101.email,'senha falsa')).resolves.toBeFalsy()
    })

})