// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
    return 1;
};

const totalLikes = (blogs) => {
    const reducer = (total, blog) => {
        return total + blog.likes;
    };

    return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
    const reducer = (currentFavorite, blog) => {
        if (!currentFavorite) {
            return blog;
        }
        return currentFavorite.likes > blog.likes ? currentFavorite : blog;
    };

    const reduced = blogs.reduce(reducer, {});

    const result = {
        title: reduced.title,
        author: reduced.author,
        likes: reduced.likes
    };

    return result;
};

const mostBlogs = (blogs) => {
    // build map of blogs
    const authorToBlogs = new Map();
    blogs.forEach((blog) => {
        if (!authorToBlogs.has(blog.author)) {
            authorToBlogs.set(blog.author, 0);
        }
        authorToBlogs.set(blog.author, authorToBlogs.get(blog.author) + 1);
    });

    // find author with the most blogs
    let maxAuthor = '';
    let maxNum = 0;
    authorToBlogs.forEach((num, author) => {
        if (num > maxNum) {
            maxAuthor = author;
            maxNum = num;
        }
    });

    const result = {
        author: maxAuthor,
        blogs: maxNum
    };

    return result;
};

const mostLikes = (blogs) => {
    // build map of blogs
    const authorToLikes = new Map();
    blogs.forEach((blog) => {
        if (!authorToLikes.has(blog.author)) {
            authorToLikes.set(blog.author, 0);
        }
        authorToLikes.set(blog.author, authorToLikes.get(blog.author) + blog.likes);
    });

    // find author with the most blogs
    let maxAuthor = '';
    let maxNum = 0;
    authorToLikes.forEach((num, author) => {
        if (num > maxNum) {
            maxAuthor = author;
            maxNum = num;
        }
    });

    const result = {
        author: maxAuthor,
        likes: maxNum
    };

    return result;
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
};