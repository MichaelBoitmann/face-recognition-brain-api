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
app.use(express.json());

app.get('/', (req, res) => { res.send(userDB.users) })
app.post('/signin', (req, res) => { signin.handleSignin(userDB, bcrypt) })
app.post('/register', (req, res) => { register.handleRegister(req, res, userDB, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, userDB) })
app.put('/image', (req, res) => { image.handleImage(req, res, userDB) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

app.listen(3000, () => {
    console.log('app.listen line is running on port 3000');
})
