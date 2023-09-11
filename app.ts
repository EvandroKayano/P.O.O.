import { Bike } from "./bike"
import { Rent } from "./rent"
import { User } from "./user"

export class App{
    users: User[] = []
    bikes: Bike[] = []
    rents: Rent[] = []

    findUser(email: string): User {
        return this.users.find(user => user.email === email)
    }

    findBike(id: string): Bike {
        return this.bikes.find(x => x.id === id)
    }

    registerBike(bike: Bike): void { //já existe a bike, só adiciona ela no array
        this.bikes.push(bike)
    }

    addUser(user: User): void {
        //push = insere no array
        //this.users.push(user), mas pode aderir 2x o mesmo então

        // .some é uma função booleano que procura ALGUMA variavel e retorna se tem ou não
        // .some passa uma função como parâmetro
        // ao usar .some, (há uma variavel qualquer, que é utilizada depois 
        //para se equiparar à uma condição)

//       if(this.users.some (user => {return user.email === user.email}) ){
        // === compara o tipo da variavel, 'bit a bit'

//           throw Error('Duplicated User with same email already registred.')
//        }

        this.users.push(user)
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
        const rents1 = this.rents.filter(z => z.bike.id === bike_id) // array de uma especifica
        const client = this.findUser(email) // achei client
        const product = this.findBike(bike_id) // achei bike
        
        const newRent = Rent.create(rents1,product,client,start,end)
        // data de retorno é declarada com ? entao nao precisa passar
        this.rents.push(newRent)
    }

    findRent(bike:Bike,user:User):Rent{
        return this.rents.find(x => x.user === user && x.bike === bike)
    }

    returnBike(bike_id : string, user: User,retrive: Date): void{
        const bici = this.findBike(bike_id)
        const usur = this.findUser(user.email)
        const contra = this.findRent(bici,usur)

        contra.dateReturned = retrive
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

    printRents():void{
        console.log(" ")
        console.log("These are the active contracts:")
        const rentsActive = this.rents.filter( x => x.dateReturned == undefined)
        // rents que não foram devolvidos
        console.log(rentsActive)
    }

    autentifyUser(userID:string,password:string):void {
        const user = this.users.find( x => x.id === userID)
        //DESCRIPTOGRAFAR AQUI
        //ALTERAR A VARIÁVEL QUAND FIZER O DESCRIPTOG
        if(user.password === password){
            console.log(" ")
            console.log("User Autentified!")
        }
        else{
            console.log(" ")
            console.log("User not found!")
        }

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