"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(name, email, password, 
    // '?' significa que é um dado OPCIONAL
    id) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.id = id;
    }
}
exports.User = User;
