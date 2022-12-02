const notes = require('express').Router();
const fs = require("fs");
const uuid = require("../helper/uuid");
const dbFile = "./db/db.json";

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
    console.log(`${req.method} request received for notes`);
    fs.readFile(dbFile, "utf-8", (error, data) => res.status(200).json(JSON.parse(data)));
});

// POST Route for a new note
notes.post('/', (req, res) => {
    console.log(`${req.method} request received for notes`);
    
    // destructing title and text for notes in req.body
    const {title, text} = req.body;
    // If all the required properties are present
    if (title && text) {
        // variables for the object we will save
        const newNote = {
            title,
            text,
            id: uuid()
        }

        // obtain existing notes
        fs.readFile(dbFile, "utf8", (err, data) => {
            if(err) {
                console.error(err);
            } else {
                // convert string into an incidence/object
                const parsedNotes = JSON.parse(data);

                // add a new note
                parsedNotes.push(newNote);

                // write updated notes back to the file
                fs.writeFile(dbFile, JSON.stringify(parsedNotes, null, 4), (err) => err ? console.error(err) : console.info("Successfully updated notes!"));
            }
        });

        // http response
        const response = {
            status: "success",
            body: newNote,
        };
        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json("Missing note title or body.");
    }
});

module.exports = notes;
