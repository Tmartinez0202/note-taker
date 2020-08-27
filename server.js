const fs = require("fs");
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));


let notes = [];
let id;

const readNotes = () => {
    fs.readFile(__dirname + "/db/db.json", (err, response) => {
        if (err) throw err;
        notes = JSON.parse(response);
    });
};

const writeNotes = () => {
    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), (err) => {
        if (err) throw err;
    });
};


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    readNotes();
    res.json(notes);
});


app.post("/api/notes", (req, res) => {

    newNote = req.body;
    id = notes.length + 1;
    newNote.id = id++;
   
    notes.push(newNote);

    writeNotes();
    console.log("Note written to db.json");

    res.json(notes);

});

app.delete("/api/notes/:id", (req, res) => {
    var chosenId = parseInt(req.params.id);
    let foundNote = notes.find(note => note.id === chosenId);
       
    notes.splice(notes.indexOf(foundNote), 1);

    writeNotes();
    console.log("Note deleted from db.json");

    readNotes();

    res.json(foundNote);
})

app.listen(PORT, () => {
    readNotes();
    console.log(`Listening on PORT ${PORT}`);
});