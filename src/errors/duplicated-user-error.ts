
export class DuplicatedUserError extends Error{
    public readonly = 'DuplicatedUserError'

    constructor(){
        super('User duplicated.')
    }
}