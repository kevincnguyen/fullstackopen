require('express-async-errors');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 });
    response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
    const body = request.body;

    if (!body.title || !body.url) {
        return response.status(400).json({
            error: 'title/url is missing'
        });
    }

    const user = request.user;

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user.id
    });

    const result = await blog.save();
    user.blogs = user.blogs.concat(result._id);
    await user.save();

    response.status(201).json(result);
});

blogsRouter.delete('/:id', async (request, response) => {
    const user = request.user;
    const blog = await Blog.findById(request.params.id);

    if (blog.user.toString() !== user.id.toString()) {
        return response.status(401).json({ error: 'this blog can only be deleted by its author' });
    }

    const result = await Blog.findByIdAndRemove(request.params.id);
    if (result) {
        response.status(204).end(); // successfully found blog
    } else {
        response.status(404).end(); // unsuccessfully found blog (undefined)
    }
});

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body;

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: body.user
    };

    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        blog,
        { new: true, runValidators: true, context: 'query' }
    );
    response.json(updatedBlog);
});

module.exports = blogsRouter;


