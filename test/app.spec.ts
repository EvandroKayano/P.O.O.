import sinon from "sinon"
import { App } from "../src/app"
import { Bike } from "../src/bike"
import { Gps } from "../src/gps"
import { User } from "../src/user"
import { UserNotFoundError } from "../src/errors/user-not-found-error"
import { BikeNotFoundError } from "../src/errors/bike-not-found-error"
import { DuplicatedUserError } from "../src/errors/duplicated-user-error"
import { UnavailableBikeError } from "../src/errors/unavailable-bike-error"
import { FakeUserRepo } from "./doubles/FakeUserRepo"
import { FakeBikeRepo } from "./doubles/FakeBikeRepo"
import { FakeRentRepo } from "./doubles/FakeRentRepo"
import { UserRepo } from "../src/ports/user-repo"
import { BikeRepo } from "../src/ports/bike-repo"
import { RentRepo } from "../src/ports/rent-repo"
import { RentNotFoundError } from "../src/errors/rent-not-found-error"
import { UserWithOpenRentError } from "../src/errors/user-with-open-rent-error"


let userRepo : UserRepo
let bikeRepo : BikeRepo
let rentRepo : RentRepo




describe('app', () => {

    // metodo para não ter que declarar userRepo em todos os outros metodos
    beforeEach(()=>{
        userRepo = new FakeUserRepo()
        bikeRepo = new FakeBikeRepo()
        rentRepo = new FakeRentRepo()
    })

    //ReturnBike ERROR
    it('should correctly calculate the rent amount', async() => {
        // este metodo REPO usado apenas para teste
        const app = new App(userRepo,bikeRepo,rentRepo)

        const User101 = new User('Joao','j@unifesp.br','1234')
        await app.registerUser(User101)

        const local = new Gps(0.0 , 0.0)
        const bici = new Bike('Caloi','Street',100,2, 100 ,'BEST SELLER!!!', 9.5,[],true,local,)
        await app.registerBike(bici)
        
        //para dar erro de return, precisa retornar uma bike que não teve rent declarado
        //await app.rentBike(bici.id,User101.email)
    
        await expect(app.returnBike(bici.id,User101.email)).rejects.toThrow(RentNotFoundError)
    })

    //ReturnBike
    it('should correctly calculate the rent amount', async() => {
        // este metodo REPO usado apenas para teste

        const app = new App(userRepo,bikeRepo,rentRepo)
        const User101 = new User('Joao','j@unifesp.br','1234')

        await app.registerUser(User101)

        const local = new Gps(0.0 , 0.0)
        const bici = new Bike('Caloi','Street',100,2, 100 ,'BEST SELLER!!!', 9.5,[],true,local,)
        const clock = sinon.useFakeTimers();

        await app.registerBike(bici)
        
        await app.rentBike(bici.id,User101.email)
    
        const hour = 1000* 60 * 60
        clock.tick(2 * hour)
    
        const rentAmount = await app.returnBike(bici.id,User101.email)
        expect(rentAmount).toEqual(200.0)
    })

    //FindUser ERROR
    it('should throw user not found error when user is not found',async () => {
        const app = new App(userRepo,bikeRepo,rentRepo)
        await expect(app.findUser('fake@email.com')).rejects.toThrow(UserNotFoundError)
    })


    //FindUser
    it('should return the user searched',async () => {
        const app = new App(userRepo,bikeRepo,rentRepo)
        const User101 = new User('Joao','j@unifesp.br','1234')
        await app.registerUser(User101)
        const userTest = await app.findUser('j@unifesp.br')

        expect(userTest).toEqual(User101)
    })


    //RegisterUser ERROR
    it('should throw user duplicated when registering a registered user', async() =>{ 
        const app = new App(userRepo,bikeRepo,rentRepo)
        const User101 = new User('Joao','j@unifesp.br','1234')
        await app.registerUser(User101)
        await expect(app.registerUser(User101) ).rejects.toThrow(DuplicatedUserError)
    })


    //RegisterUser
    it('should be able to register a user', async() =>{ 
        const app = new App(userRepo,bikeRepo,rentRepo)
        const User101 = new User('Joao','j@unifesp.br','1234')
        const userNewId = await app.registerUser(User101)
        
        const userList = await app.userRepo.list()

        expect( userList[0].id ).toEqual(userNewId)
    })

    
    //Authenticate ERROR
    it('should throw False when autenticating a user with a wrong password', async() => {
        const app = new App(userRepo,bikeRepo,rentRepo)
        const User101 = new User('Joao','j@unifesp.br','1234')
        await app.registerUser(User101)

        await expect(app.authenticate(User101.email,'senha falsa')).resolves.toBeFalsy()
    })


    //Authenticate 
    it('should throw True when autenticating a user with the right password', async() => {
        const app = new App(userRepo,bikeRepo,rentRepo)
        const User101 = new User('Joao','j@unifesp.br','1234')
        await app.registerUser(User101)

        await expect( app.authenticate(User101.email,'1234' )).resolves.toBeTruthy()
    })


    //RegisterBike
    it('should be able to register a bike', async() => {
        const app = new App(userRepo,bikeRepo,rentRepo)
        const bike = new Bike('caloi','bmx',12,20,5,'Best Seller!!!',100,[])
        const bikeNewId = await app.registerBike(bike)

        const bikeList = await app.bikeRepo.list()
        
        expect( bikeList[0].id ).toEqual(bikeNewId)
    })


    //RemoveUser Error
    it('should throw an exception when trying to remove a user with an open rent', async() => {
        const app = new App(userRepo,bikeRepo,rentRepo)
        const User101 = new User('Joao','j@unifesp.br','1234')
        await app.registerUser(User101)

        const bike = new Bike('Caloi','Street',100,2, 100 ,'BEST SELLER!!!', 9.5,[],true,)
        await app.registerBike(bike)

        await app.rentBike(bike.id,User101.email)

        // User101 tem um rent em aberto ainda

        await expect( app.removeUser('j@unifesp.br') ).rejects.toThrow(UserWithOpenRentError)
    })


    //RemoveUser
    it('should sucessfully remove a user', async() => {
        const app = new App(userRepo,bikeRepo,rentRepo)
        const User101 = new User('Joao','j@unifesp.br','1234')
        await app.registerUser(User101)
        await app.removeUser(User101.email)

        await expect( app.findUser('j@unifesp.br') ).rejects.toThrow(UserNotFoundError)
    })


    //RentBike ERROR
    it('should throw unavailable bike when trying to rent an unavailable bike', async () => {
        const app = new App(userRepo,bikeRepo,rentRepo)
        const User101 = new User('Joao','j@unifesp.br','1234')
        await app.registerUser(User101)
        const bike = new Bike('Caloi','Street',100,2, 100 ,'BEST SELLER!!!', 9.5,[],true,)
        await app.registerBike(bike)
        await app.rentBike(bike.id,User101.email)

        await expect(app.rentBike(bike.id,User101.email)).rejects.toThrow(UnavailableBikeError)
    })


    //RentBike
    it('should correctly handle a bike rent', async () => {


        const app = new App(userRepo,bikeRepo,rentRepo)
        const User101 = new User('Joao','j@unifesp.br','1234')
        await app.registerUser(User101)
        const bike = new Bike('Caloi','Street',100,2, 100 ,'BEST SELLER!!!', 9.5,[],true,)
        await app.registerBike(bike)
        await app.rentBike(bike.id,User101.email)

        const rents = await app.rentRepo.list()
        // const rents = (app.rentRepo as FakeRentRepo)

        expect(rents.length).toEqual(1)
        expect(rents[0].bike.id).toEqual(bike.id)
        expect(rents[0].user.email).toEqual(User101.email)
        expect(rents[0].bike.available).toBeFalsy()


    })


    //MoveBikeTo ERROR
    it('should throw an expection when trying to move an unregistered bike',async () => {
        const app = new App(userRepo,bikeRepo,rentRepo)
        // não precisa declarar uma bike
        const bike = new Bike('Caloi','Street',100,2, 50 ,'BEST SELLER!!!', 9.5,[],true,)
        const NY = new Gps(40.753056, -73.983056)

        await expect(app.moveBikeTo(bike.id,NY)).rejects.toThrow(BikeNotFoundError)
        // BikeNotFoundError nova class que é representa ERROR
        // EXPECT FOI USADO DE MANEIRA DIFERENTE
    })


    //MoveBikeTo
    it('should be able to move a bike to a specific location', async() => {
        const app = new App(userRepo,bikeRepo,rentRepo)
        const bici = new Bike('Caloi','Street',100,2, 50 ,'BEST SELLER!!!', 9.5,[],true,)
        await app.registerBike(bici)

        const NY = new Gps(40.753056, -73.983056)
        await app.moveBikeTo(bici.id, NY)
        expect(bici.location.lati).toEqual(NY.lati)
        expect(bici.location.long).toEqual(NY.long)
    })

    //removeBike
    it('should be able to remove a registered bike', async() => {
        const app = new App(userRepo,bikeRepo,rentRepo)
        const bici = new Bike('Caloi','Street',100,2, 50 ,'BEST SELLER!!!', 9.5,[],true,)
        await app.registerBike(bici)
        const bikes = app.bikeRepo.list()

        await app.removeBike(bici.id)

        expect(bikes[0]).toEqual(undefined)
    })

    //findOpenRentFor
    it('should find a user with an open rent', async() => {
        const app = new App(userRepo,bikeRepo,rentRepo)
        const User101 = new User('Joao','j@unifesp.br','1234')
        await app.registerUser(User101)    
        const bici = new Bike('Caloi','Street',100,2, 50 ,'BEST SELLER!!!', 9.5,[],true,)
        await app.registerBike(bici)

        //rentBike retorna o id do rent
        const newRentId = await app.rentBike(bici.id,User101.email)
        const idTest = (await rentRepo.findOpenRentFor(User101.email)).id

        expect(idTest).toEqual(newRentId)
         
    })


})