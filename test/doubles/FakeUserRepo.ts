import { UserRepo } from "../../src/ports/user-repo";
import { User } from "../../src/user";
import crypto from 'crypto'


// array de usuarios
export class FakeUserRepo implements UserRepo{
    users:User[] = []

    async find(email:string):Promise <User>{
        return this.users.find(x => x.email === email)
        // senão achar, retorna 'Undefined'
    }

    async add(user:User): Promise <string>{
        const newId = crypto.randomUUID()
        user.id = newId
        this.users.push(user)
        return newId
    }

    async remove(email:string):Promise <void>{
        const userIndex = this.users.findIndex(user => user.email === email)
        this.users.splice(userIndex, 1)
        return
    }

    async list():Promise<User[]>{
        return this.users        
    }
}