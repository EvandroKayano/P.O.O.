import request from 'supertest';
import server from '../src/server';
import prisma from '../src/external/database/db'

describe('Register user route', () => {
    beforeEach(async () => {
        await prisma.user.deleteMany({})
    })

    afterAll(async () => {
        await prisma.user.deleteMany({})
    })

    it('registers a bike with valid data',async () => {
        await request(server)
            .post('api/bikes')
            .send({
                name: 'caloi',
                type: 'bmx',
                bodySize: 5,
                maxLoad: 2,
                rate: 4.5,
                description:'good',
                ratings: 100.0,
                imageURL: ['http://image1.com','http://image2.com'],
                available: true,
                latitude: 0.0,
                longitude: 0.0
            })
            .expect(201) // erro 201
            .then((res) => {
                expect(res.body.id).toBeDefined()
            })
    })


})