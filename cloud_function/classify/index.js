const automl = require('@google-cloud/automl');
const config = require('./config');

function predict(req, res) {
  const client = new automl.PredictionServiceClient();

  client
    .predict({
      name: client.modelPath(config.PROJECT_ID, config.REGION, config.MODEL_ID),
      payload: {
        textSnippet: {
          content: req.body.message
        }
      }
    })
    .then(responses => {
      var response = responses[0];
      res.send(response);
    })
    .catch(err => {
      console.error(err);
    });
}

exports.classify = (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
    res.set('Access-Control-Allow-Origin', '*');
    predict(req, res);
  }
};
