import bodyParser from 'body-parser';
import express, { query } from 'express';
import { parseQuery } from './template_engine.js';


export const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.post('/render', (req, res) => {
  if(!req.body.template) {
    return res.status(400).send({
      erorrMessage: 'template is required'
    });
  }

  try {
    const result = parseQuery(req.body)
    return res.status(200).send({
      result: result
    })
  }
  catch (e) {
    return res.status(400).send({
      erorrMessage: 'An error occurred while parsing the template',
      detail: e.stack

    })
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
