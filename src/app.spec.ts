import sinon from "sinon"
import { App } from "./app"
import { Bike } from "./bike"
import { Gps } from "./gps"
import { User } from "./user"
import { UserNotFoundError } from "../errors/user-not-found-error"
import { BikeNotFoundError } from "../errors/bike-not-found-error"
import { DuplicatedUserError } from "../errors/duplicated-user-error"
import { UnavailableBikeError } from "../errors/unavailable-bike-error"



describe('app', () => {

    //FindUser ERROR
    it('should throw user not found error when user is not found',() => {
        const app = new App()
        expect(() => { app.findUser('fake@email.com') }).toThrow(UserNotFoundError)
    })


    //FindUser
    it('should return the user searched',async () => {
        const app = new App()
        const User101 = new User('Joao','j@unifesp.br','1234')
        await app.registerUser(User101)
        const userTest = app.findUser('j@unifesp.br')

        expect(userTest).toEqual(User101)
    })


    //RegisterUser ERROR
    it('should throw user duplicated when registering a registered user', async() =>{ 
        const app = new App()
        const User101 = new User('Joao','j@unifesp.br','1234')
        await app.registerUser(User101)
        await expect(app.registerUser(User101) ).rejects.toThrow(DuplicatedUserError)
    })


    //RegisterUser
    it('should be able to register a user', async() =>{ 
        const app = new App()
        const User101 = new User('Joao','j@unifesp.br','1234')
        const userNewId = await app.registerUser(User101)
        
        expect( app.users[0].id ).toEqual(userNewId)
    })


    
    //Authenticate ERROR
    it('should throw False when autenticating a user with a wrong password', async() => {
        const app = new App()
        const User101 = new User('Joao','j@unifesp.br','1234')
        await app.registerUser(User101)

        await expect(app.authenticate(User101.email,'senha falsa')).resolves.toBeFalsy()
    })

    //Authenticate 
    it('should throw True when autenticating a user with the right password', async() => {
        const app = new App()
        const User101 = new User('Joao','j@unifesp.br','1234')
        await app.registerUser(User101)

        await expect( app.authenticate(User101.email,'1234' )).resolves.toBeTruthy()
    })

    //RegisterBike
    it('should be able to register a bike', async() => {
        const app = new App()
        const bike = new Bike('caloi','bmx',12,20,5,'Best Seller!!!',100,[])
        const bikeNewId = app.registerBike(bike)
        
        expect( app.bikes[0].id ).toEqual(bikeNewId)
    })

    //RemoveUser
    it('should sucessfully remove a user', async() => {
        const app = new App()
        const User101 = new User('Joao','j@unifesp.br','1234')
        await app.registerUser(User101)
        app.removeUser('j@unifesp.br')

        expect(app.bikes[0]).toEqual(undefined)
    })


    //RemoveUser Error
    it('should return UserNotFoundError', async() => {
        const app = new App()
        const User101 = new User('Joao','j@unifesp.br','1234')
        
        expect(() => {app.removeUser('j@unifesp.br')}).toThrow(UserNotFoundError)
    })


    //RentBike
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

    //RentBike ERROR
    it('should throw unavailable bike when trying to rent with an unavailable bike', async () => {
        const app = new App()
        const User101 = new User('Joao','j@unifesp.br','1234')
        await app.registerUser(User101)
        const bike = new Bike('Caloi','Street',100,2, 100 ,'BEST SELLER!!!', 9.5,[],true,)
        app.registerBike(bike)
        app.rentBike(bike.id,User101.email)

        expect(() => { app.rentBike(bike.id,User101.email) }).toThrow(UnavailableBikeError)
    })


    //ReturnBike
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

    //MoveBikeTo
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

    //MoveBikeTo ERROR
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

})