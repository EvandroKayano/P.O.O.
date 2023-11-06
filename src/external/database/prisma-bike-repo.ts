import { BikeRepo } from '../../ports/bike-repo'
import { Bike } from '../../bike'
import prisma from './db'

export class PrismaBikeRepo implements BikeRepo {

    async find(id: string): Promise<Bike> {
        return await prisma.bike.findFirst({
            where:{ id }
        })
    }

    async add(bike: Bike): Promise<string> {
        const addedBike = await prisma.bike.create({
            data:{...bike}
        })
        return addedBike.id
    }

    async remove(id: string): Promise<void> {
        await prisma.bike.delete({
            where:{id}
        })
    }


    async list(): Promise<Bike[]> {
        return await prisma.bike.findMany({})
    }

    // atualiza apenas se está disponivel ou não
    async updateAvailability(id: string, available:boolean): Promise<void> {
        await prisma.bike.update({
            where:{id},
            data:{available}
        })
    }

    async updateLocation(id: string, latitude:number,longitude:number): Promise<void> {
        await prisma.bike.update({
            where:{id},
            data:{latitude,longitude}
        })
    }

}