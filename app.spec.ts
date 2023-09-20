import sinon from "sinon"
import { App } from "./app"
import { Bike } from "./bike"
import { Gps } from "./gps"
import { User } from "./user"



describe('app', () => {
    it('should correctly calculate the remt amount', async() => {
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
        const local = new Gps(0.0 , 0.0)
        const bici = new Bike('Caloi','Street',100,2, 50 ,'BEST SELLER!!!', 9.5,[],true,local,)
        app.registerBike(bici)

        const NY = new Gps(40.753056, -73.983056)
        app.moveBikeTo(bici.id,NY)
        expect(bici.location.lati).toEqual(NY.lati)
        expect(bici.location.long).toEqual(NY.long)
    })



    it('should throw an expection when trying to move an unregistered', () => {
        const app = new App()
        const local = new Gps(0.0 , 0.0)
        const bike = new Bike('Caloi','Street',100,2, 50 ,'BEST SELLER!!!', 9.5,[],true,local,)
        const NY = new Gps(40.753056, -73.983056)
        expect( () => {(app.moveBikeTo(bike.id,NY))}).toThrow('Bike not registered or not found.')

        // EXPECT FOI USADO DE MANEIRA DIFERENTE
    })
})