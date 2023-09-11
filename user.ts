export class User {
    constructor(
        public name: string,
        public email: string,
        public password: string,
        // '?' significa que é um dado OPCIONAL
        public id?: string
    ){}
}