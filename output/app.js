"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const rent_1 = require("./rent");
const crypt_1 = require("./crypt");
const crypto_1 = __importDefault(require("crypto"));
class App {
    constructor() {
        this.users = [];
        this.bikes = [];
        this.rents = [];
        this.crypt = new crypt_1.Crypt();
    }
    findUser(email) {
        return this.users.find(user => user.email === email);
    }
    findBike(id) {
        return this.bikes.find(x => x.id === id);
    }
    findRent(bike, user) {
        return this.rents.find(x => x.user === user && x.bike === bike);
    }
    listUsers() {
        return this.users;
    }
    listBikes() {
        return this.bikes;
    }
    listRents() {
        return this.rents;
    }
    printUsers() {
        console.log(" ");
        console.log("These are the registered users:");
        console.log(this.users);
    }
    printBikes() {
        console.log(" ");
        console.log("These are the available bikes:");
        console.log(this.bikes);
    }
    registerBike(bike) {
        this.bikes.push(bike);
    }
    addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            //push = insere no array
            //this.users.push(user), mas pode aderir 2x o mesmo então
            // .some é uma função booleano que procura ALGUMA variavel e retorna se tem ou não
            // .some passa uma função como parâmetro
            // ao usar .some, (há uma variavel qualquer, que é utilizada depois 
            //para se equiparar à uma condição)
            if (this.users.some(x => { return x.email === user.email; })) {
                // === compara o tipo da variavel, 'bit a bit'
                throw new Error('Duplicated User with same email already registred.');
            }
            const newID = crypto_1.default.randomUUID();
            user.id = newID;
            const encryptedPassword = yield this.crypt.encrypt(user.password);
            user.password = encryptedPassword;
            this.users.push(user);
            return newID;
        });
    }
    removeUser(ID) {
        if (this.users.some(x => { return x.id === ID; })) { // se tem
            const n = this.users.findIndex(y => { return y.id === ID; }); // acha onde está
            this.users.splice(n, 1);
        }
        else {
            console.log("User not found.");
        }
    }
    rentBike(email, bike_id, start, end) {
        const user = this.findUser(email);
        const bike = this.findBike(bike_id);
        const now = new Date(); //new Date pega a hora de AGORA
        bike.available = false;
        const rent = new rent_1.Rent(bike, user, now);
        this.rents.push(rent);
    }
    returnBike(bike_id, user, retrive) {
        const bike = this.findBike(bike_id);
        const rent = this.findRent(bike, user);
        const agora = new Date();
        rent.end = agora;
        const hours = diff_hours(rent.end, rent.start);
        bike.available = true;
        return hours * bike.hourly;
    }
    autenticate(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.findUser(email);
            if (!user)
                throw new Error('User not found.');
            return yield this.crypt.compare(password, user.password);
        });
    }
}
exports.App = App;
function diff_hours(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return Math.abs(diff);
}
// '1' == 1 , TRUE
// '1' === 1, FALSE
// const array = [1,2,3,-1]
// array.some( item => { return item < 0 } )
// algum numero no array negativo
// retorna TRUE
// array.every( item => { return item < 0 } )
// retorna FALSE , 'every'  ->  todos tem que ser negativos
