export class UserWithOpenRentError extends Error{
    public readonly = 'UserWithOpenRentError'

    constructor(){
        super('User still has an open rent.')
    }
}