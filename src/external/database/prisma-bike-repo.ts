import { BikeRepo } from '../../ports/bike-repo'
import { Bike } from '../../bike'
import {Gps} from '../../gps'
import prisma from './db'

export class PrismaBikeRepo implements BikeRepo {

    async find(id: string): Promise<Bike> {
        const persistedBike = await prisma.bike.findUnique({
            where:{ id },
            include: { imageURL: true }
            // inclui chave estrangeira
        })

        if(!persistedBike) return null

        return {
            ...persistedBike,
            location: new Gps(persistedBike.latitude,persistedBike.longitude)
        }
    }

    async add(bike: Bike): Promise<string> {
        const addedBike = await prisma.bike.create({
            data:{
                name:   bike.name,
                type:   bike.type,
                bodySize:   bike.bodySize,
                maxLoad:    bike.maxLoad,
                rate:   bike.rate,
                description:    bike.description,
                ratings:    bike.ratings,
                imageURL: {
                    create:[
                        ...bike.imageURL.map((url: string) => ({url}))
                        // para cada item do vetor imageURL (string), cria um novo url para tabela imageURL
                        // { url: bike.imageURL[0]},
                        // { url: bike.imageURL[1]}
                    ]
                },
                available: bike.available,
                latitude: bike.location.lati,
                longitude: bike.location.long
            }
        })
        return addedBike.id
    }

    async remove(id: string): Promise<void> {
        await prisma.bike.delete({
            where:{id}
        })
    }


    async list(): Promise<Bike[]> {
        return await prisma.bike.findMany({
            include:{
                imageURL: true
            }
        })
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