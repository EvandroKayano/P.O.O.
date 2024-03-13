import { User } from "../../../src/user"
import prisma from '../../../src/external/database/db'
import { PrismaUserRepo } from "../../../src/external/database/prisma-user-repo"

describe ('PrismaUserRepo',()=>{
    beforeEach(async()=>{
        await prisma.user.deleteMany({})
    })

    afterEach(async()=>{
        await prisma.user.deleteMany({})
    })

    it('adds a user in the database', async ()=>{
        const userToBePersisted = new User('Evandro','e@unifesp.br','1234')
        const repo = new PrismaUserRepo()
        const userId = await repo.add(userToBePersisted)
        expect(userId).toBeDefined()
        
        const persistedUser = await repo.find(userToBePersisted.email)
        expect(persistedUser.name).toEqual(userToBePersisted.name)
    })

    it('removes a user in the database', async ()=>{
        const userToBePersisted = new User('Evandro','e@unifesp.br','1234')
        const repo = new PrismaUserRepo()
        await repo.add(userToBePersisted)
        await repo.remove(userToBePersisted.email)
        const removedUser = await repo.find(userToBePersisted.email)
        expect(removedUser).toBeNull()
    })

    it('lists all users in the database', async ()=>{
        const user1 = new User('Evandro','e@unifesp.br','1234') 
        const user2 = new User('Costi','gcs@gmail.com','gapsj12345')
        const repo = new PrismaUserRepo()
        await repo.add(user1)
        await repo.add(user2)
        const listUsers = await repo.list()
        expect(listUsers.length).toEqual(2)    
    })

})