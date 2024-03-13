export class UserNotFoundError extends Error{
    public readonly = 'UserNotFoundError'

    constructor(){
        super('User not found.')
    }
}