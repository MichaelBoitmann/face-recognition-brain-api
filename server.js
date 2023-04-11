const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

const database = {
  users: [
  {
    id: '123',
    name: 'Michael',
    email: 'michael@gmail.com',
    password: 'lenovo',
    entries: 0,
    joince: new Date() 
  },
  {
    id: '124',
    name: 'Joyce',
    email: 'joyce@gmail.com',
    password: 'red',
    entries: 0,
    joince: new Date() 
  },
  {
    id: '125',
    name: 'Angel',
    email: 'angel@gmail.com',
    password: 'rotorua',
    entries: 0,
    joined: new Date() 
  }
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: 'michael@gmail.com'
    }
  ]
}

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

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  // bcrypt.hash(password, null, null, function(err, hash) {
  //   console.log(hash);

  database.users.push({
    id: '135',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date() 
  })
  res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  })
  if (!found) {
    res.status(400).json('profile found');
  }
})

app.post('/image', (req, res) => {
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
