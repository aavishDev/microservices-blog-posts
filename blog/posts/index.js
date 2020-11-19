const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { randomBytes } = require('crypto');

const app = express();
const posts = {};

app.use(bodyParser.json());
app.use(cors());



app.get('/posts', (req, res) => {
  res.status(200).send(posts);
});

app.post('/posts/create', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id, title
  };

  await axios.post('http://event-bus-srv:5000/events/', {
    type: 'PostCreated',
    data: { id, title }
  });

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  const { type } = req.body;
  console.log(`${type} event received`);
  res.send({ status: 'OK' });
});

app.listen(4000, () => {
  console.log('v30');
  console.log('Posts listening on 4000');
});