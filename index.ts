import { App } from "./app";
import { Bike } from "./bike";
import { Gps } from "./gps";
import { Rent } from "./rent";
import { User } from "./user";

async function main(){
    const app = new App()
    const User101 = new User('Joao','j@unifesp.br','1234')
    await app.addUser(User101)
    console.log(app.users)
    console.log(await app.autenticate('j@unifesp.br','1234'))

    const local = new Gps(0.0 , 0.0)
    const bici = new Bike('Caloi','Street',100,2, 50 ,'BEST SELLER!!!', 9.5,[],true,local,)
    // considere x = 0.0 , y = ? e z = 0.0 como a posição inicial da bike
    // não sei typescript, portanto pensei no mais basico possivel
    local.walkE()
    local.walkN()
    local.walkN()

    console.log(bici.local)
}

main()