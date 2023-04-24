
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();
app.use(express.json());


// Connection to MongoDB
mongoose.connect('mongodb://localhost/usersDB', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('connected to MongoDB');
    });

    // GET route to get users
    app.get('/users', async (req, res) => {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) { 
            res.status(500).json({message: 'could not get user(s)', error: err});
        }
    });


    // POST route to add a new user
app.post('/users', async (req, res) => {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    try {
        const user = await newUser.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({message: 'unable to add user', error: err });
    }
});


// UPDATE User route
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    try {
        const user = await User.findByIdAndUpdate(id, { name,email, password }, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).json({message: 'Failed to edit user', error: err});
    }
});


// DELETE route 
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        res.json(user);
    } catch (err) {
        res.status(500).json({message: 'Failed to remove user', error: err});
    }
});


const PORT = 8000;
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:${PORT}');
});
