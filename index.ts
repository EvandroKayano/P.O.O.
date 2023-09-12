import { App } from "./app";
import { Bike } from "./bike";
import { Rent } from "./rent";
import { User } from "./user";

async function main(){
    const app = new App()
    const User101 = new User('Joao','j@unifesp.br','1234')
    await app.addUser(User101)
    console.log(app.users)
    console.log(await app.autenticate('j@unifesp.br','1234'))
}
