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
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const bike_1 = require("./bike");
const gps_1 = require("./gps");
const user_1 = require("./user");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = new app_1.App();
        const User101 = new user_1.User('Joao', 'j@unifesp.br', '1234');
        yield app.addUser(User101);
        console.log(app.users);
        console.log(yield app.autenticate('j@unifesp.br', '1234'));
        const local = new gps_1.Gps(0.0, 0.0);
        const bici = new bike_1.Bike('Caloi', 'Street', 100, 2, 50, 'BEST SELLER!!!', 9.5, [], true, local);
        // considere x = 0.0 , y = ? e z = 0.0 como a posição inicial da bike
        // não sei typescript, portanto pensei no mais basico possivel
        local.walkE();
        local.walkN();
        local.walkN();
        console.log(bici.local);
    });
}
main();
