const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());


app.post('/events', async (req, res) => {

  const { type, data } = req.body;
  console.log(`${type} event received`);

  if (type === 'CommentCreated') {
    let { id, content, status, postId } = data;
    status = content.includes('orange') ? 'rejected' : 'approved';

    await axios.post('http://event-bus-srv:5000/events/', {
      type: 'CommentModerated',
      data: { id, content, status, postId }
    });
  }

  res.send({});
});


app.listen(4003, () => console.log('Moderation listening on 4003'));