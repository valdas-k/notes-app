let currentTask = null;

function updateTitle() {
  if (document.getElementById('saved-notes').children.length > 0) {
    document.getElementById('list-header').textContent = "Saved notes:";
    document.getElementById('download-notes').style.display = "block";
    document.getElementById('delete-all-notes').style.display = "block";
  } else {
    document.getElementById('list-header').textContent = "No notes saved";
    document.getElementById('download-notes').style.display = "none";
    document.getElementById('delete-all-notes').style.display = "none";
  }
}

function addNote() {
  const title = document.getElementById('new-note-title').value;
  const description = document.getElementById('new-note-description').value;
  if (title.length == 0) {
    alert("Please fill the title field");
  } else if (description.length == 0) {
    alert("Please fill the description field");
  } else {
    if (currentTask === null) {
      const date = formatDate();
      const notes = document.getElementById('saved-notes');
      const note = fillNote(date, title, description);
      saveNote(date, title, description);
      notes.appendChild(note);
      updateTitle();

      const updateLink = document.createElement('a');
      updateLink.href = `#${date}`;
      updateLink.click();
    } else {
      const id = document.getElementById('new-note-id').value;
      let originalNotes = JSON.parse(localStorage.getItem("notes-app")) || [];
      const updatedNotes = originalNotes.map(note =>
        note.id === id ? { ...note, title: title, description: description } : note
      )
      localStorage.setItem("notes-app", JSON.stringify(updatedNotes));
      currentTask = null;
      loadNotes();

      const updateLink = document.createElement('a');
      updateLink.href = `#${id}`;
      updateLink.click();
    }
    resetNote();
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
  resetNote();
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
  innerDiv.appendChild(deleteButton);

  const updateButton = document.createElement('button');
  updateButton.classList.add('update-note');
  updateButton.textContent = `Update`;
  innerDiv.appendChild(updateButton);
  addNoteEvents(updateButton, deleteButton);

  div.appendChild(innerDiv);
  return div;
}

function addNoteEvents(updateButton, deleteButton) {
  updateButton.addEventListener('click', (event) => {
    updateNote(event);
    const updateLink = document.createElement('a');
    updateLink.href = '#new-note';
    updateLink.click();
  })

  deleteButton.addEventListener('click', (event) => {
    deleteNote(event);
  })
}

function updateNote(event) {
  currentTask = 1;
  const noteId = event.target.parentElement.parentElement.id;
  let notesArray = JSON.parse(localStorage.getItem("notes-app")) || [];
  let chosenNote = notesArray.filter(note => note.id == noteId);
  document.getElementById('new-note-id').value = chosenNote[0].id;
  document.getElementById('new-note-title').value = chosenNote[0].title;
  document.getElementById('new-note-description').value = chosenNote[0].description;
}

function deleteNote(event) {
  if (confirm("Do You want to delete this note?")) {
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

function downloadNotes() {
  let notes = JSON.parse(localStorage.getItem("notes-app")) || [];
  let text = ``;
  notes.forEach(note => {
    text += `${note.id}\n${note.title}\n${note.description}\n\n`;
  });
  let blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'MyNotes.txt';
  link.click();
}

function deleteAllNotes() {
  if (confirm("Do You want to delete all notes?")) {
    document.getElementById('saved-notes').innerHTML = ``;
    localStorage.setItem("notes-app", JSON.stringify([]));
    loadNotes();
  }
}

function loadEvents() {
  document.getElementById('add-note').addEventListener('click', () => {
    addNote();
  })
  document.getElementById('reset-note').addEventListener('click', () => {
    resetNote();
  })
  document.getElementById('download-notes').addEventListener('click', () => {
    downloadNotes();
  })
  document.getElementById('delete-all-notes').addEventListener('click', () => {
    deleteAllNotes();
  })
}

loadNotes();
loadEvents();