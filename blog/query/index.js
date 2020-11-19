const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  console.log(`${type} event received`);

  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id , title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id , content, postId, status });
  }

  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const updateCommentIndex = post.comments.findIndex(com => com.id === id);
    post.comments[updateCommentIndex] = { id, content, postId, status };
  }

  res.send({});
});

app.listen(4002, () => console.log('Query listening on 4002'));