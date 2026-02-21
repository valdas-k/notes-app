let currentTask = null;
function chooseTask() {
  if (currentTask === null) {
    addNote();
  } else {
    changeNote();
  }
}

function updateTitle() {
  if (document.getElementById('saved-notes').children.length > 0) {
    document.getElementById('list-header').textContent = "Saved Notes:";
  } else {
    document.getElementById('list-header').textContent = "No Notes Saved";
  }
}

function changeNote() {
  console.log("changed note");
  currentTask = null;
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
    const date = formatDate();
    const note = fillNote(date, title, description);
    saveNote(date, title, description);
    notes.appendChild(note);
    resetNote();
    updateTitle();
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
    const div = fillNote(note.id, note.title, note.description);
    savedNotes.appendChild(div);
  });
  updateTitle();
}

function fillNote(id, title, description) {
  const div = document.createElement('div');
    div.classList.add('saved-note');
    div.id = id;

    const p1 = document.createElement('p');
    p1.classList.add('saved-note-date');
    p1.innerHTML = `<em>${id}</em>`;
    div.appendChild(p1);

    const p2 = document.createElement('p');
    p2.classList.add('saved-note-title');
    p2.innerHTML = `<strong>${title}</strong>`;
    div.appendChild(p2);

    const p3 = document.createElement('p');
    p3.classList.add('saved-note-description');
    p3.textContent = `${description}`;
    div.appendChild(p3);

    const innerDiv = document.createElement('div');
    innerDiv.classList.add('saved-note-controls');

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-note');
    deleteButton.textContent = `Delete`;
    addDeleteEvent(deleteButton);
    innerDiv.appendChild(deleteButton);

    const updateButton = document.createElement('button');
    updateButton.classList.add('update-note');
    updateButton.textContent = `Update`;
    addUpdateEvent(updateButton);

    innerDiv.appendChild(updateButton);
    div.appendChild(innerDiv);
    return div;
}

function addDeleteEvent(button) {
  button.addEventListener('click', (event) => {
    deleteNote(event);
  })
}

function addUpdateEvent(button) {
  button.addEventListener('click', (event) => {
    updateNote(event);
  })
}

function updateNote(event) {
  currentTask = 1;
  const noteId = event.target.parentElement.parentElement.id;
  let notesArray = JSON.parse(localStorage.getItem("notes-app")) || [];
  let chosenNote = notesArray.filter(note => note.id == noteId);
  document.getElementById('new-note-title').value = chosenNote[0].title;
  document.getElementById('new-note-description').value = chosenNote[0].description;
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