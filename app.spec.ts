
import sinon from "sinon"
import { App } from "./app"
import { Bike } from "./bike"
import { Gps } from "./gps"
import { User } from "./user"



describe('app', () => {
    it('should correctly calculate the remt amount', async() => {
        const app = new App()
        const User101 = new User('Joao','j@unifesp.br','1234')
        await app.addUser(User101)
        const local = new Gps(0.0 , 0.0)
        const bici = new Bike('Caloi','Street',100,2, 50 ,'BEST SELLER!!!', 9.5,[],true,local,)
        app.registerBike(bici)

        const clock = sinon.useFakeTimers();

        app.rentBike(bici.id,User101.email)

        const hour = 1000* 60 * 60
        clock.tick(2 * hour)

        const rentAmount = app.returnBike(bici.id,User101)
        expect(rentAmount).toEqual(200.0)
    })

    it('should ne able to move a bike to a specific location', async() => {
        const app = new App()
        const User101 = new User('Joao','j@unifesp.br','1234')
        await app.addUser(User101)
        const local = new Gps(0.0 , 0.0)
        const bici = new Bike('Caloi','Street',100,2, 50 ,'BEST SELLER!!!', 9.5,[],true,local,)
        app.registerBike(bici)

        const NY = new Gps(40.753056, -73.983056)
        app.moveBikeTo(bici.id,NY)
        expect(bici.local.lati).toEqual(NY.lati)
        expect(bici.local.long).toEqual(NY.long)
    })



    // it('should throw an expection when trying to move an unregistered', () => {
    //     const app = new App()
    //     const local = new Gps(0.0 , 0.0)
    //     const als = new Bike('Caloi','Street',100,2, 50 ,'BEST SELLER!!!', 9.5,[],true,local,)
    //     const NY = new Gps(40.753056, -73.983056)
    //     app.moveBikeTo(als.id,NY)
    // })
})