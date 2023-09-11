import bcrypt from 'bcrypt'

export class Crypt{
    private rounds = 10

    async encrypt(password: string): Promise<string> {
        return await bcrypt.hash(password, this.rounds)
    }

    async compare(password: string, encrypted: string): Promise<boolean> {
        return await bcrypt.compare(password,encrypted)
    }

}