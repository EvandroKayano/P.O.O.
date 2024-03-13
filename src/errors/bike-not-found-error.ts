export class BikeNotFoundError extends Error{
    public readonly = 'BikeNotFoundError'

    constructor(){
        super('Bike not found.')
    }
}