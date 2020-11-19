const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { randomBytes } = require('crypto');

const app = express();
const commentsByPostId = {};

app.use(bodyParser.json());
app.use(cors());



app.get('/posts/:id/comments', (req, res) => {
  res.status(200).send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {

  const id = randomBytes(4).toString('hex');
  const { content } = req.body;
  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id, content });

  commentsByPostId[req.params.id] = comments;

  await axios.post('http://event-bus-srv:5000/events/', {
    type: 'CommentCreated',
    data: { id, content, postId: req.params.id, status: 'pending' }
  });

  res.status(201).send(commentsByPostId[req.params.id]);

});


app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  console.log(`${type} event received`);

  if (type === 'CommentModerated') {
    const { id, content, postId, status } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find(com => com.id === id);
    comment.status = status;
    comment.content = content;


    await axios.post('http://event-bus-srv:5000/events', {
      type: 'CommentUpdated',
      data: { id, content, postId, status }
    });
  }

  res.send({ status: 'OK' });
});

app.listen(4001, () => console.log('Comments listening on 4001'));