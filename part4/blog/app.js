const config = require('./utils/config');
const blogsRouter = require('./controllers/blogs');

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

app.use('/api/blogs', blogsRouter);

module.exports = app;