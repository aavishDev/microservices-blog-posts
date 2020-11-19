const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());

app.post('/events', async (req, res) => {
  const event = req.body;

  await axios.post('http://posts-cluster-ip:4000/events', event); // Posts
  await axios.post('http://comments-srv:4001/events', event); // Comments
  await axios.post('http://query-srv:4002/events', event); // Query
  await axios.post('http://moderation-srv:4003/events', event); // Moderation

  res.send({ status: 'OK' });
});

app.listen(5000, () => console.log('Listening event bus on 5000'));
