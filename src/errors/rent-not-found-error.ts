
export class RentNotFoundError extends Error{
    public readonly = 'RentNotFoundError'

    constructor(){
        super('Rent not found.')
    }
}