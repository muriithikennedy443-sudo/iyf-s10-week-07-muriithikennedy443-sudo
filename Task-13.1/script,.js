// EXERCISE 1: localStorage Basics

// Store a simple value
localStorage.setItem("username", "John");

// Retrieve the value
const username = localStorage.getItem("username");
console.log(username); // "John"

// Check if key exists
if (localStorage.getItem("username")) {
  console.log("User exists");
}

// Remove a value
localStorage.removeItem("username");

// Clear everything (commented out so app still works)
// localStorage.clear();

// EXERCISE 2: Storing Objects (JSON)

const user = {
  name: "John",
  age: 30,
  hobbies: ["coding", "reading"]
};

// WRONG - stores "[object Object]"
localStorage.setItem("user", user);
console.log("WRONG:", localStorage.getItem("user")); // [object Object]

// RIGHT - serialize to JSON
localStorage.setItem("user", JSON.stringify(user));
const retrieved = JSON.parse(localStorage.getItem("user"));
console.log("RIGHT:", retrieved); // { name: "John", age: 30, ... }

// EXERCISE 3: Helper Functions

function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getFromStorage(key, defaultValue = null) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
}

function removeFromStorage(key) {
  localStorage.removeItem(key);
}

// Usage
saveToStorage("settings", { theme: "dark", fontSize: 16 });
const settings = getFromStorage("settings", { theme: "light" });
console.log("Settings:", settings);

// BUILD: Notes App using localStorage

function getNotes() {
  return getFromStorage("notes", []);
}

function saveNotes(notes) {
  saveToStorage("notes", notes);
}

function addNote() {
  const title = document.getElementById("noteTitle").value.trim();
  const content = document.getElementById("noteContent").value.trim();

  if (!title || !content) {
    alert("Please fill in both title and content.");
    return;
  }

  const notes = getNotes();

  const newNote = {
    id: Date.now(),
    title,
    content,
    date: new Date().toLocaleString()
  };

  notes.unshift(newNote);
  saveNotes(notes);

  document.getElementById("noteTitle").value = "";
  document.getElementById("noteContent").value = "";

  renderNotes();
}

function deleteNote(id) {
  let notes = getNotes();
  notes = notes.filter(note => note.id !== id);
  saveNotes(notes);
  renderNotes();
}

function clearAllNotes() {
  if (confirm("Delete ALL notes? This cannot be undone.")) {
    removeFromStorage("notes");
    renderNotes();
  }
}

function renderNotes() {
  const notes = getNotes();
  const container = document.getElementById("notesContainer");
  const stats = document.getElementById("stats");

  stats.textContent = `${notes.length} note${notes.length !== 1 ? "s" : ""} saved in localStorage`;

  if (notes.length === 0) {
    container.innerHTML = '<div class="empty-state">No notes yet. Add your first note above!</div>';
    return;
  }

  container.innerHTML = notes.map(note => `
    <div class="note-card">
      <h3>${note.title}</h3>
      <p>${note.content}</p>
      <div class="note-meta">📅 ${note.date}</div>
      <button class="btn-danger" onclick="deleteNote(${note.id})">🗑 Delete</button>
    </div>
  `).join("");
}

// Start the app
renderNotes();