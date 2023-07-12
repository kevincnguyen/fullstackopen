const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

const bcrypt = require('bcryptjs');
const User = require('../models/user');
const helper = require('./test_helper');

// tests
describe('when there are initially users saved in db', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({ username: 'billybobs', name: 'Bob Smith', passwordHash });

        await user.save();
    });

    test('users are returned in JSON format', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    }, 100000);

    test('correct number of users are returned', async () => {
        const response = await api.get('/api/users');
        expect(response.body).toHaveLength(1);
    }, 1000000);
});

describe('addition of a new user', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({ username: 'billybobs', name: 'Bob Smith', passwordHash });

        await user.save();
    });

    test('succeeds with valid data', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'bobo',
            name: 'BOBBY',
            password: 'asdasdasd',
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

        const usernames = usersAtEnd.map(u => u.username);
        expect(usernames).toContain(newUser.username);
    });

    test('fails with status code 400 Bad Request if missing username', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            name: 'Matti Luukkainen',
            password: 'salainen'
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('username required');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });


    test('fails with status code 400 Bad Request if username < 3 characters', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'Ma',
            name: 'Matti Luukkainen',
            password: 'salainen'
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('username must at least be 3 characters');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });

    test('fails with status code 400 Bad Request if username already exists', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'billybobs',
            name: 'Bob Smith',
            password: 'sekret'
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('username already exists');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});