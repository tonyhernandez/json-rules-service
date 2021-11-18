const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const { Engine } = require('json-rules-engine')
const fs = require('fs');

const app = express();
const port = 3000;

const processRules = (request) => {
  const rule = readRules(`./src/rules/${request.rules}.json`);
  const engine = new Engine(rule.decisions);   
  return engine.run(request.inputs);
}; 
 
const readRules = (jsonFile) => {
  const rawdata = fs.readFileSync(jsonFile);
  return JSON.parse(rawdata);
};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/rule', async(req, res) => {
  const request = req.body;
  const result = await processRules(request);
  res.send(result.events);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Rules Engine app listening on port ${port}!`);
});
