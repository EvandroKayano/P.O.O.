import { Rent } from "../rent";

export interface RentRepo {
    add(rent:Rent): Promise <string>
    find(id:string): Promise <Rent>
    findOpen(bike_id:string,userEmail:string):Promise<Rent>
    findOpenRentFor(email:string): Promise <Rent[]>
    updateEnd(id:String, end:Date): Promise<void>
    list(): Promise <Rent[]>
}