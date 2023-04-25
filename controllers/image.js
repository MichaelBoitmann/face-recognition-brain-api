const Clarifai = require('clarifai');

//Add your own API key here from Clarifai. 
const app = new Clarifai.App({
 apiKey: 'e7bf11813a9f4b4da81c7fab358e6db9' 
});

const handleApiCall = (req, res) => 
  app.models.predict('face-detection', req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
  

const handleImage = (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0].entries)
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
  handleApiCall,
  handleImage
}