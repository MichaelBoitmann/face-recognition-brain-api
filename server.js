const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
const userDatabase = {
    users: [
        {
            id: '134', 
            name: 'Michael',
            email: 'michael@gmail.com',
            password: 'lenovo',
            entries: 0,
            joined: new Date()
        },
        {
            id: '135',
            name: 'Jocelyn',
            email: 'joyce@gmail.com',
            password: 'iphone13',
            entries: 0,
            joined: new Date()            
        }
    ]
}

app.get('/', (req, res) => {
    res.send(userDatabase.users);
})

app.post('/signin', (req, res) => {
    if(req.body.email === userDatabase.users[0].email &&
        req.body.password === userDatabase.users[0].password) {
        res.json('success');
    } else {
        res.status(400).json('error logging in');
    }
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    userDatabase.users.push({
        id: '136',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date() 
    })
    res.json(userDatabase.users[userDatabase.users.length-1]);
})

app.get('/profile/:id', (req,res) => {
    const { id } = req.params;
    let found = false;
    userDatabase.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        } 
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

app.post('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    userDatabase.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        } 
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

app.listen(3001, () => {
    console.log('app.listen line is running on port 3001');
})

/*
/ --> res = this is working
/signin --> POST = successful/fail
/register --> POST = user
/profile/:userId --> GET = user
/increase the counter when submitting a photos
/image --> PUT --> user
*/