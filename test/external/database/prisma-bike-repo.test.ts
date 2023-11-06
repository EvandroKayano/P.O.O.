import { Bike } from "../../../src/bike"
import prisma from '../../../src/external/database/db'
import { PrismaBikeRepo } from "../../../src/external/database/prisma-bike-repo"

describe ('PrismaBikeRepo',()=>{
    beforeEach(async()=>{
        await prisma.bike.deleteMany({})
    })

    afterEach(async()=>{
        await prisma.bike.deleteMany({})
    })


    it('adds a bike in the database', async ()=>{
        const newBike = new Bike('caloi','mountain',10,2,9.3,'bike example',9.6,true,0.0,0.0)
        const repo = new PrismaBikeRepo()
        const bikeId = await repo.add(newBike)
        expect(bikeId).toBeDefined()
        
        const foundBike = await repo.find(bikeId)
        expect(foundBike.name).toEqual(newBike.name)
    })

    it('removes a bike in the database', async () => {
        const newBike = new Bike('caloi','mountain',10,2,9.3,'bike example',9.6,true,0.0,0.0)
        const repo = new PrismaBikeRepo()
        const bikeId = await repo.add(newBike)
        await repo.remove(bikeId)
        const removedBike = await repo.find(bikeId)
        expect(removedBike).toBeNull()
    })

    it('lists all bikes in the database', async () => {
        const repo = new PrismaBikeRepo()
        const bike1 = new Bike('caloi','mountain',10,2,9.3,'bike example',9.6,true,0.0,0.0)
        const bike2 = new Bike('Oggi','bmx',10,2,9.3,'bike example',9.8,true,0.0,0.0)
        await repo.add(bike1)
        await repo.add(bike2)
        const bikeList = await repo.list()
        expect(bikeList.length).toEqual(2)
    })

    // update availability
    it('updates a bike availability in the database', async () => {
        const newBike = new Bike('caloi','mountain',10,2,9.3,'bike example',9.6,true,0.0,0.0)
        const repo = new PrismaBikeRepo()
        const bikeId = await repo.add(newBike)
        await repo.updateAvailability(bikeId,false)
        const updatedBike = await repo.find(bikeId)
        expect(updatedBike.available).toBeFalsy()
    })
    
    // update location
    it('updates a bike location in the database', async () => {
        const newBike = new Bike('caloi','mountain',10,2,9.3,'bike example',9.6,true,0.0,0.0)
        const repo = new PrismaBikeRepo()
        const bikeId = await repo.add(newBike)
        await repo.updateLocation(bikeId,1.4,5.7)
        const updatedBike = await repo.find(bikeId)
        expect(updatedBike.latitude).toEqual(1.4)
        expect(updatedBike.longitude).toEqual(5.7)
    })

})