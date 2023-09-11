import { Bike } from "./bike"
import { Rent } from "./rent"
import { User } from "./user"
import { Crypt } from './crypt'
import crypto from 'crypto'

export class App{
    users: User[] = []
    bikes: Bike[] = []
    rents: Rent[] = []
    crypt: Crypt = new Crypt()

    findUser(email: string): User {
        return this.users.find(user => user.email === email)
    }

    findBike(id: string): Bike {
        return this.bikes.find(x => x.id === id)
    }

    findRent(bike:Bike,user:User):Rent{
        return this.rents.find(x => x.user === user && x.bike === bike)
    }

    listUsers(): User[] {
        return this.users
    }

    listBikes(): Bike[] {
        return this.bikes
    }

    listRents(): Rent[] {
        return this.rents
    }

    printUsers():void{
        console.log(" ")
        console.log("These are the registered users:")
        console.log(this.users)
    }

    printBikes():void{
        console.log(" ")
        console.log("These are the available bikes:")
        console.log(this.bikes)
    }

    registerBike(bike: Bike): void { //já existe a bike, só adiciona ela no array
        this.bikes.push(bike)
    }

    async addUser(user: User): Promise <string> {
        //push = insere no array
        //this.users.push(user), mas pode aderir 2x o mesmo então

        // .some é uma função booleano que procura ALGUMA variavel e retorna se tem ou não
        // .some passa uma função como parâmetro
        // ao usar .some, (há uma variavel qualquer, que é utilizada depois 
        //para se equiparar à uma condição)

       if(this.users.some (x => {return x.email === user.email}) ){
        // === compara o tipo da variavel, 'bit a bit'

           throw Error('Duplicated User with same email already registred.')
        }
        const newID = crypto.randomUUID()
        user.id = newID


        const encryptedPassword = await this.crypt.encrypt(user.password)
        user.password = encryptedPassword
        
        this.users.push(user)
        return newID
    }


    removeUser(ID:string): void {
        if(this.users.some (x => {return x.id === ID} ) ){ // se tem
            const n: number = this.users.findIndex(y => {return y.id === ID}) // acha onde está
            this.users.splice(n,1)
        }
        else{
            console.log("User not found.")
        }
    }


    rentBike(email: string, bike_id: string,  start: Date, end: Date):void {
        const user = this.findUser(email)
        const bike = this.findBike(bike_id)
        const now = new Date() //new Date pega a hora de AGORA
        bike.available = false
        const rent = new Rent(bike,user,now,)
        this.rents.push(rent)
    }

    returnBike(bike_id : string, user: User,retrive: Date): number {
        const bike = this.findBike(bike_id)
        const rent = this.findRent(bike,user)
        const agora = new Date()

        rent.end = agora

        
    }

    async autenticate(email:string,password:string): Promise <boolean>{
        const user = this.findUser(email)
        if(!user) throw new Error ('User not found.')
        return await this.crypt.compare(password, user.password)
    }

}

// '1' == 1 , TRUE
// '1' === 1, FALSE

// const array = [1,2,3,-1]
// array.some( item => { return item < 0 } )
// algum numero no array negativo
// retorna TRUE

// array.every( item => { return item < 0 } )
// retorna FALSE , 'every'  ->  todos tem que ser negativos
