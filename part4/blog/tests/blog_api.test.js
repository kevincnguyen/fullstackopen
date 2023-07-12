const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Blog = require('../models/blog');
const helper = require('./test_helper');

beforeEach(async () => {
    await Blog.deleteMany({});
    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog));
    const blogPromises = blogObjects.map(blog => blog.save());
    await Promise.all(blogPromises);

    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'billybobs', name: 'Bob Smith', passwordHash });
    await user.save();
});

describe('when there are initially blogs saved in db', () => {
    test('blogs are returned in JSON format', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    }, 100000);

    test('correct number of blogs are returned', async () => {
        const response = await api.get('/api/blogs');
        expect(response.body).toHaveLength(helper.initialBlogs.length);
    }, 100000);

    test('each blog has unique id', async () => {
        const response = await api.get('/api/blogs');
        for (const blog of response.body) {
            expect(blog.id).toBeDefined();
        }
    }, 100000);
});

describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
        const newBlog = {
            title: 'Cooking',
            author: 'Bob Smith',
            url: 'https://example.com/',
            likes: 100
        };

        const oldLength = (await api.get('/api/blogs')).body.length;

        const loggedIn = await api
            .post('/api/login')
            .send({
                username: 'billybobs',
                password: 'sekret'
            });

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${loggedIn.body.token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const response = await api.get('/api/blogs');

        const blogs = response.body.map(b => {
            const blog = {
                title: b.title,
                author: b.author,
                url: b.url,
                likes: b.likes
            };
            return blog;
        });

        expect(response.body).toHaveLength(oldLength + 1);

        expect(blogs).toContainEqual(newBlog);
    }, 100000);

    test('the likes property will default to 0 if missing', async () => {
        const newBlog = {
            title: 'My Diary',
            author: 'Billy Bob',
            url: 'https://example.com/'
        };

        const loggedIn = await api
            .post('/api/login')
            .send({
                username: 'billybobs',
                password: 'sekret'
            });

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${loggedIn.body.token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const response = await api.get('/api/blogs');
        const foundBlog = response.body.filter(blog =>
            blog.title === newBlog.title &&
            blog.author === newBlog.author &&
            blog.url === newBlog.url
        )[0];
        expect(foundBlog.likes).toBe(0);
    }, 100000);

    test('fails with status code 401 Unauthorized if a token is not provided', async () => {
        const startBlogs = await helper.blogsInDb();
        const newBlog = {
            title: 'My Diary',
            author: 'Billy Bob',
            url: 'https://example.com/'
        };

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', 'Bearer 12345')
            .expect(401)
            .expect('Content-Type', /application\/json/);

        const endBlogs = await helper.blogsInDb();
        expect(endBlogs).toHaveLength(startBlogs.length);
    }, 100000);

    test('fails with status code 400 Bad Request if the url property is missing', async () => {
        const startBlogs = await helper.blogsInDb();
        const newBlog = {
            title: 'Reviews',
            author: 'Joe Mama',
            likes: 10
        };

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400);

        const endBlogs = await helper.blogsInDb();
        expect(endBlogs).toHaveLength(startBlogs.length);
    }, 100000);

    test('fails with status code 400 Bad Request if the title property is missing', async () => {
        const startBlogs = await helper.blogsInDb();
        const newBlog = {
            author: 'Joe Mama',
            url: 'https://example.com/',
            likes: 10
        };

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400);

        const endBlogs = await helper.blogsInDb();
        expect(endBlogs).toHaveLength(startBlogs.length);
    }, 100000);

    test('fails with status code 400 Bad Request if the url and title properties are missing', async () => {
        const startBlogs = await helper.blogsInDb();
        const newBlog = {
            author: 'Joe Mama',
            likes: 10
        };

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400);

        const endBlogs = await helper.blogsInDb();
        expect(endBlogs).toHaveLength(startBlogs.length);
    }, 100000);
});

describe('deletion of a blog', () => {
    test('succeeds with valid data', async () => {
        const startBlogs = await helper.blogsInDb();
        const blogToDelete = startBlogs[0];

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204);

        const endBlogs = await helper.blogsInDb();

        expect(endBlogs).toHaveLength(startBlogs.length - 1);
        expect(endBlogs).not.toContainEqual(blogToDelete);
    });
});

describe('updating a blog', () => {
    test('succeeds with valid data', async () => {
        const startBlogs = await helper.blogsInDb();
        const blogToUpdate = { ...startBlogs[0], likes: -1 };

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdate)
            .expect(200);

        const endBlogs = await helper.blogsInDb();

        expect(endBlogs).toHaveLength(startBlogs.length);
        expect(endBlogs).not.toContainEqual(startBlogs[0]);
        expect(endBlogs).toContainEqual(blogToUpdate);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});