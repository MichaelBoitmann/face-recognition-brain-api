const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');


const userDB = knex({
    client: 'pg',
    connection: {
      host : 'localhost',
      port : '5432',
      user : 'postgres',
      password : 'boitmann',
      database : 'smart-brain'
    }
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

// app.get('/', (req, res) => {
//     res.send(userDatabase.users);
//     console.log(users);
// })

app.post('/signin', (req, res) => {
    userDB.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            console.log(data);
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isValid) {
                return userDB.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        console.log(user);
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).jason('unable to  get user'))
            } else {
                res.status(400).json('1st wrong credentials')
            }
        })
        .catch(err => res.status(400).json('2nd wrong credentials'))
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    userDB.transaction(trx => {
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
                res.json(user[0])
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register...'))
})

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
