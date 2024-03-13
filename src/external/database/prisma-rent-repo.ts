import { RentRepo } from "../../ports/rent-repo";
import { Rent } from "../../rent";
import prisma from './db'

export class PrismaRentRepo implements RentRepo {



    async add(rent: Rent): Promise<string> {
        const persistedRent = await prisma.rent.create(
            {
                data:{
                    start: rent.start,
                    // a bike é, conecta no banco, que tem esse id, que é igual a esse id da bike do rent
                    bike:{
                        connect: {
                            id: rent.bike.id
                        }
                    },
                    user:{
                        connect: {
                            id: rent.user.id
                        }
                    }  
                }
          
            }
        )
        return persistedRent.id
    }



    async find(id:String): Promise <Rent> {
        return await prisma.rent.findFirst({
            where:{id},
            include:{
                bike:true,
                user:true
            }
        })
    }



    async findOpen(bikeId: string, userEmail: string): Promise<Rent> {
        return await prisma.rent.findFirst({
            where:{
                AND: [
                    {bikeId},
                    {user:{
                        is: {email: userEmail}
                        }
                    },
                    {end:null}
                ]
            },
            include:{
                bike:true,
                user:true
            }
        })
    }



    async findOpenRentFor(userEmail: string): Promise<Rent[]> {
        return await prisma.rent.findMany({
            where:{
                user: {
                    is: {email:userEmail}
                }
            },
            include:{
                bike:true,
                user:true
            }
        })
    }



    async updateEnd(id: String, end:Date): Promise<void> {
        await prisma.rent.update({
            where:{
                id
            },
            data:{
                end
            }
        })
    }



    list(): Promise<Rent[]> {
        throw new Error("Method not implemented.");
    }






}