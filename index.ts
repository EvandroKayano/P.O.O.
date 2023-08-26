import { aluguel } from './aluguel'
import { bike } from './bike'
import { pessoa } from './pessoa'

const marcelo = new pessoa("Marcelo","000.00.00-0")
const caloi = new bike('ABC1',100.0)
const contrato = new aluguel(caloi,marcelo,5)

console.log(contrato.preco)
console.log(contrato.cliente.nome)