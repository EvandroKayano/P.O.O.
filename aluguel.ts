import { bike } from "./bike"
import { pessoa } from "./pessoa"

export class aluguel{
    dias : number
    preco : number
    bicicleta : bike
    cliente : pessoa

    constructor(bicicleta : bike, cliente : pessoa, dias: number){
        this.bicicleta = bicicleta
        this.cliente = cliente
        this.dias = dias
        this.preco = dias*bicicleta.valor
    }

}