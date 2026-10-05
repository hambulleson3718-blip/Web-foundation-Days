// Starting notes
const notes = [
    {
        id: 1,
        title: "Learn JavaScript",
        body: "Practice arrays and functions",
        tags: ["javascript", "coding"],
        pinned: true
    },
    {
        id: 2,
        title: "HTML Practice",
        body: "Build a simple webpage",
        tags: ["html", "web"],
        pinned: false
    },
    {
        id: 3,
        title: "CSS Basics",
        body: "Learn selectors and styling",
        tags: ["css", "web"],
        pinned: false
    }
];


// 1. Find a note by ID
function findNoteById(id) {
    return notes.find(note => note.id === id);
}


// 2. Get pinned notes
function getPinnedNotes() {
    return notes.filter(note => note.pinned === true);
}


// 3. Get notes by tag
function getNotesByTag(tag) {
    return notes.filter(note =>
        note.tags.includes(tag)
    );
}


// 4. Add a new note
function addNote(title, body, tags = [], pinned = false) {
    const newNote = {
        id: notes.length + 1,
        title: title,
        body: body,
        tags: tags,
        pinned: pinned
    };

    notes.push(newNote);
    return newNote;
}


// 5. Toggle pinned status
function togglePinned(id) {
    const note = findNoteById(id);

    if (note) {
        note.pinned = !note.pinned;
        return note;
    }

    return undefined;
}


// 6. Delete a note by ID
function deleteNote(id) {
    const index = notes.findIndex(note => note.id === id);

    if (index !== -1) {
        return notes.splice(index, 1)[0];
    }

    return undefined;
}


// TESTS

// Test 1: Find note by ID
console.log("Find note:", findNoteById(1));
console.log("Find missing note:", findNoteById(99));

// Test 2: Get pinned notes
console.log("Pinned notes:", getPinnedNotes());
console.log("Pinned notes after checking:", getPinnedNotes());

// Test 3: Get notes by tag
console.log("JavaScript notes:", getNotesByTag("javascript"));
console.log("Web notes:", getNotesByTag("web"));

// Test 4: Add note
console.log(
    "Added note:",
    addNote(
        "JavaScript Functions",
        "Practice array methods",
        ["javascript", "practice"],
        false
    )
);

console.log("All notes after adding:", notes);

// Test 5: Toggle pinned
console.log("Toggle note 2:", togglePinned(2));
console.log("Toggle note 2 again:", togglePinned(2));

// Test 6: Delete note
console.log("Deleted note:", deleteNote(3));
console.log("Notes after deletion:", notes);