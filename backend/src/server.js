const express = require('express');
const cors = require('cors');
const _ = require('lodash');

const app = express();

const port = 8080;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const data = require('./api.json');


// Lists all available candidates
app.get('/candidates', (req, res) => {
    res.send(data.candidates);
})

// Lists all available questions
app.get('/questions', (req, res) => {
    res.send(data.questions);
})

// Lists all available applications
app.get('/applications', (req, res) => {
    res.send(data.applications);
})

app.post('/comments/:id', (req, res) => {

    const value = Object.keys(req.body).toString();
    const id = req.params.id;

    const itemData = _.map(data.applications, item => item.videos);

    const comments = _.map(itemData[0], val => val);
    // console.log(comments);

    addComment(id, value)
    function addComment(id, value) {
        for (let i = 0; i < comments.length; i++) {
            if (comments[i].questionId === id)
                comments[i].comments = value;
            return;
        }
    }

})

// Server Setup
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})