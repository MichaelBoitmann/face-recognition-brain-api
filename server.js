const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : 'localhost',
    port : '5432',
    user : 'postgres',
    password : 'boitmann',
    database : 'smart-face-detector'
  }
});

// Access to database built from Postgres
// db.select('*').from('users').then(mich => {
//   console.log(mich);
// });

const app = express();

// const database = {
//   users: [
//   {
//     id: '123',
//     name: 'Michael',
//     email: 'michael@gmail.com',
//     password: 'lenovo',
//     entries: 0,
//     joince: new Date() 
//   },
//   {
//     id: '124',
//     name: 'Joyce',
//     email: 'joyce@gmail.com',
//     password: 'red',
//     entries: 0,
//     joince: new Date() 
//   },
//   {
//     id: '125',
//     name: 'Angel',
//     email: 'angel@gmail.com',
//     password: 'rotorua',
//     entries: 0,
//     joined: new Date() 
//   }
//   ],
//   login: [
//     {
//       id: '987',
//       hash: '',
//       email: 'michael@gmail.com'
//     }
//   ]
// }

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send(database.users);
})

app.post('/signin', (req, res) => {
  if (req.body.email === database.users[0].email &&
      req.body.password === database.users[0].password) {
    res.json(database.users[0]);
  } else {
    return res.status(400).json('error in signing in')
  }
})
// Register for new user
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  db('users')
    .returning('*')
    .insert({
      email: email,
      name: name,
      joined: new Date()
    })
    .then(user => {
      res.json(user[0]);
    })
    .catch(err => res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  db.select('*').from('users').where({id})
    .then(user => {
      console.log(user)
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(error => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++
      return res.json(user.entries);
    }
  })
  if (!found) {
    res.status(400).json('user not found');
  }
})

app.listen(3000, () => {
  console.log('app is running on post 3000');
})






































// const express = require('express');
// const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt-nodejs');
// const cors = require('cors');
// const knex = require('knex');

// const register = require('./controllers/register');
// const signin = require('./controllers/signin');
// const profile = require('./controllers/profile');
// const image = require('./controllers/image');

// const userDB = knex({
//   client: 'pg',
//   connection: {
//     host : 'localhost',
//     port : '5432',
//     user : 'postgres',
//     password : 'boitmann',
//     database : 'smart-brain'
//   }
// });

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get('/', (req, res) => { res.send(userDB.users) })
// app.post('/signin', (req, res) => { signin.handleSignin(userDB, bcrypt) })
// app.post('/register', (req, res) => { register.handleRegister(req, res, userDB, bcrypt) })
// app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, userDB) })
// app.put('/image', (req, res) => { image.handleImage(req, res, userDB) })
// app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

// app.listen(3000, () => {
//     console.log('app.listen line is running on port 3000');
// })
