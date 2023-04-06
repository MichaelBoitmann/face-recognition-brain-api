const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');


const userDB = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port : '5432',
    user : 'postgres',
    password : 'boitmann',
    database : 'smart-brain'
  }
});

const app = express();

app.use(cors());
app.use(bodyParser.json());


app.post('/signin', register.handleSignin)

app.post('/register', register.handleRegister)

app.get('/profile/:id', (req,res) => {
  const { id } = req.params;
  userDB.select('*').from('users').where({id})
    .then(user => {
      if (user.length) {
        res.json(user[0])
      }else {
        res.status(400).json('not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  userDB('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
      res.json(entries[0].entries)
  })
  .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3000, () => {
    console.log('app.listen line is running on port 3000');
})
