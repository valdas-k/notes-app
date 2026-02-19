function updateTitle() {
  if (document.getElementById('saved-notes').children.length > 0) {
    document.getElementById('list-header').textContent = "Saved Notes:";
  } else {
    document.getElementById('list-header').textContent = "No Notes Saved";
  }
}

function addNote() {
  const title = document.getElementById('new-note-title').value;
  const description = document.getElementById('new-note-description').value;
  if (title.length == 0) {
    alert("Please fill out the title field");
  } else if (description.length == 0) {
    alert("Please fill out the description field");
  } else {
    const notes = document.getElementById('saved-notes');
    const note = document.createElement('div');
    const date = formatDate();
    saveNote(date, title, description);

    note.classList.add('saved-note');
    note.id = date;
    note.innerHTML = `
      <p class="saved-note-date"><em>${date}</em></p>
      <p class="saved-note-title"><strong>${title}</strong></p>
      <p class="saved-note-description">${description}</p>
      <div class="saved-note-controls">
        <button class="delete-note">Delete</button>
        <button class="update-note">Update</button>
      </div>
    `;
    notes.appendChild(note);
    resetNote();
    updateTitle();
    addEventListeners();
  }
}

function saveNote(date, noteTitle, noteDescription) {
  const newNote = {
    id: date,
    title: noteTitle,
    description: noteDescription
  }

  let notesArray = JSON.parse(localStorage.getItem("notes-app")) || [];
  notesArray.push(newNote);
  localStorage.setItem("notes-app", JSON.stringify(notesArray));
}

function loadNotes() {
  let notesArray = JSON.parse(localStorage.getItem("notes-app")) || [];
  const savedNotes = document.getElementById('saved-notes');
  savedNotes.innerHTML = ``;
  notesArray.forEach(note => {
    let div = document.createElement('div');
    div.classList.add('saved-note');
    div.id = note.id;
    div.innerHTML = `
    <p class="saved-note-date"><em>${note.id}</em></p>
      <p class="saved-note-title"><strong>${note.title}</strong></p>
      <p class="saved-note-description">${note.description}</p>
      <div class="saved-note-controls">
        <button class="delete-note">Delete</button>
        <button class="update-note">Update</button>
      </div>
    `;
    savedNotes.appendChild(div);
  });
  updateTitle();
  addEventListeners();
}

function addEventListeners() {
  const deleteButtons = document.querySelectorAll('.delete-note');
  deleteButtons.forEach(button => {
    button.addEventListener('click', deleteNote)
  })
}

function deleteNote(event) {
  if (confirm("Do You Want To Delete This Note?")) {
    const note = event.target.parentElement.parentElement;
    document.getElementById('saved-notes').removeChild(note);
    const noteId = event.target.parentElement.parentElement.id;
    let notesArray = JSON.parse(localStorage.getItem("notes-app")) || [];
    const updatedArray = notesArray.filter(note => note.id !== noteId);
    localStorage.setItem("notes-app", JSON.stringify(updatedArray));
    updateTitle();
  }
}

function formatDate() {
  const currentDate = new Date();
  const formatedDate = currentDate.toISOString().slice(0, 19).replace('T', ', ');
  return formatedDate;
}

function resetNote() {
  document.getElementById('new-note-title').value = '';
  document.getElementById('new-note-description').value = '';
}

loadNotes();