const supertest = require('supertest');
const server = require('./server.js');
const db = require('../database/dbConfig');

describe('server.js', () => {

    describe("GET Jokes", () => {
        it("should respond with 401 status", async () => {
            const res = await supertest(server).get('/api/jokes');

            expect(res.status).toBe(401)
        })

        it("should respond with JSON", async () => {
            const res = await supertest(server).get('/api/jokes');

            expect(res.type).toMatch(/json/i)
        })
    })

    describe("POST Register", () => {
        beforeEach(async () => {
            await db("users").truncate();
        })

        it("should respond with 201 status", async () => {
            const res = await supertest(server).post("/api/auth/register").send({ username: 'ernie', password: '123' });

            expect(res.status).toBe(201);
        })

        it("should add user to database", async () => {
            await supertest(server).post("/api/auth/register").send({ username: 'ernie', password: '123' });

            const users = await db("users");

            expect(users).toHaveLength(1);
        })
    })

    describe("POST Login", () => {
        it("should respond with 200 status", async () => {
            const res = await supertest(server).post("/api/auth/login").send({ username: 'ernie', password: '123' });

            expect(res.status).toBe(200);
        })

        it("should respond with JSON", async () => {
            const res = await supertest(server).post("/api/auth/login").send({ username: 'ernie', password: '123' });

            expect(res.type).toMatch(/json/i)
        })
    })
})