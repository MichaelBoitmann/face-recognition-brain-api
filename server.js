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

// Listing the database built from Postgres; e.g. "users" the table name
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
  res.send(db.users);
})

app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      console.log(isValid);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            console.log(user);
            res.json(user[0])
          })
          .catch(err => res.status(400).json('unable to sign in the user'))
      } else {
        res.status(400).json('wrong credentials')
      }

    })
    .catch(err => res.status(400).json('unable to get user'))
})

// Register for new user
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          })
      })
      .then(trx.commit) // Commit to add the new user info
      .catch(trx.rollback) // If anything fails, will roll back
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
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'))
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
