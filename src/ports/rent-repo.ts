import { Rent } from "../rent";

export interface RentRepo {
    add(rent:Rent): Promise <string>
    findOpen(bike_id:string,userEmail:string):Promise<Rent>
    update(id:String, rent:Rent): Promise<void>
    list(): Promise <Rent[]>
    findOpenRentFor(email:string): Promise <Rent>
}