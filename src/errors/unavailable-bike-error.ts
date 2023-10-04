export class UnavailableBikeError extends Error{
    public readonly = 'UnavailableBikeError'

    constructor(){
        super('Unavailable bike.')
    }
}