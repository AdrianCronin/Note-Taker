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
    console.log(`GET Path: ${req.url}`);
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// return the current notes by reading `db.json`
app.get('/api/notes', (req, res) => {
    console.log(`GET Path: ${req.url}`);
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.err(err);
        } else {
            res.json(JSON.parse(data))
        }
    });
});

app.post('/api/notes', (req, res) => {
    console.log(`POST Path: ${req.url}`);
    const {title, text} = req.body; // destructure note object into its properties

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuidv4()
        };

        // read file then append new note
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.err(err);
            } else {
                const noteCollection = JSON.parse(data); // put db.json into array of objects
                noteCollection.push(newNote); // add new note object to the array

                // overwrite new collection into db.json
                fs.writeFile("./db/db.json", JSON.stringify(noteCollection, null, 4), (err) => {
                    if (err) throw err;
                    console.log('Saved db.json');
                });

                res.json(newNote); // return new note to client
            }
        });

    } else {
        res.error('Error adding Note');
    };

});

// get current notes by reading `db.json`
// find the note using the provided id
// delete the note from the collection
// rewrite collection to `db.json`
app.delete('/api/notes/:id', (req, res) => {
    console.log(`DELETE Path: ${req.url}`);
    console.log(`id: ${req.body.id}`);
    res.send(`${req.body.id}`);
});

app.get('*', (req, res) => {
    console.log(`GET Wildcard: ${req.url}`);
    res.sendFile(path.join(__dirname, '/public/index.html'))
});



// Listener
app.listen(PORT, () => {
    console.log(`App listening on PORT http://localhost:${PORT}`)
});