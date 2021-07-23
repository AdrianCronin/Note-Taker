const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // uuidv4(); ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

const app = express();
const PORT = process.env.port || 3001;

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));



// routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// return the currents notes by reading `db.json`
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.err(err);
        } else {
            res.json(data)
        }
    });
});

// get current notes by reading `db.json`
// append a new note to the collection
// save the new collection of notes to `db.json`
app.post('/api/notes', (req, res) => {
    const {title, text} = req.body; // destructure note object into its properties

    if (req.body) {
        const newNote = {
            title,
            text,
            note_id: uuidv4()
        };

        // readAndAppend function(s) here
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.err(err);
            } else {
                const noteCollection = JSON.parse(data); // put db.json into variable
                console.log(`Old noteCollection === ${JSON.stringify(noteCollection)}`);
                noteCollection.push(newNote); // add new note to the array

                fs.writeFile("./db/db.json", JSON.stringify(noteCollection), (err) => {
                    if (err) throw err;
                    console.log('Saved db.json');
                });

                res.send(`new noteCollection === ${JSON.stringify(noteCollection)}`);
            }
        });

    };


});

// get current notes by reading `db.json`
// find the note using the provided id
// delete the note from the collection
// rewrite collection to `db.json`
app.delete('/api/notes/:id', (req, res) => {
    res.send();
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});



// Listener
app.listen(PORT, () => {
    console.log(`App listening on PORT http://localhost:${PORT}`)
});