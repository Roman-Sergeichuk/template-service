import bodyParser from 'body-parser';
import express, { query } from 'express';
import { parseQuery } from './template_engine.js';


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.post('/render', (req, res) => {
  if(!req.body.template) {
    return res.status(400).send({
      erorrMessage: 'template is required'
    });
  }
  
  const query = req.body


  // Put here template parser - function
  // Sent error message if parser can't parse the template
  //  Add tests
  try {
    return res.status(200).send({
      result: parseQuery(req.body)
    })
  }
  catch (e) {
    return res.status(400).send({
        result: 'An error occurred while parsing the template'
    })
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
