let createNote = null;

document.addEventListener('DOMContentLoaded', function() {
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
  document.getElementById('close-modal').addEventListener('click', () => {
    closeModal();
  })
  loadNotes();
})

function updateSection() {
  if (document.getElementById('saved-notes').children.length > 0) {
    document.getElementById('list-header').textContent = "Saved Notes:";
    document.getElementById('download-notes').style.display = "block";
    document.getElementById('delete-all-notes').style.display = "block";
  } else {
    document.getElementById('list-header').textContent = "No Notes Saved";
    document.getElementById('download-notes').style.display = "none";
    document.getElementById('delete-all-notes').style.display = "none";
  }
}

function addNote() {
  const title = document.getElementById('new-note-title').value;
  const description = document.getElementById('new-note-description').value;
  if (title.length == 0) {
    showModal("Please fill the title field", "");
  } else if (description.length == 0) {
    showModal("Please fill the description field", "");
  } else {
    if (createNote === null) {
      const date = formatDate();
      const savedNotes = document.getElementById('saved-notes');
      const note = fillNote(date, title, description);
      saveNote(date, title, description);
      savedNotes.appendChild(note);
      updateSection();
      clickLink(date);
    } else {
      const id = document.getElementById('new-note-id').value;
      let originalNotes = getNotes();
      const updatedNotes = originalNotes.map(note =>
        note.id === id ? { ...note, title: title, description: description } : note
      )
      createNote = null;
      saveNotes(updatedNotes);
      loadNotes();
      clickLink(id);
    }
    resetNote();
  }
}

function saveNote(date, title, description) {
  const note = {
    id: date,
    title: title,
    description: description,
  }
  const notes = getNotes();
  notes.push(note);
  saveNotes(notes);
}

function saveNotes(notes) {
  localStorage.setItem("notes-app", JSON.stringify(notes));
}

function getNotes() {
  const notes = JSON.parse(localStorage.getItem("notes-app")) || [];
  return notes;
}

function loadNotes() {
  const notes = getNotes();
  const savedNotes = document.getElementById('saved-notes');
  savedNotes.innerHTML = ``;
  notes.forEach(note => {
    const div = fillNote(note.id, note.title, note.description);
    savedNotes.appendChild(div);
  });
  updateSection();
  resetNote();
}

function updateNote(event) {
  createNote = 1;
  const noteId = event.target.parentElement.parentElement.id;
  let notes = getNotes();
  let chosenNote = notes.filter(note => note.id == noteId);
  document.getElementById('new-note-id').value = chosenNote[0].id;
  document.getElementById('new-note-title').value = chosenNote[0].title;
  document.getElementById('new-note-description').value = chosenNote[0].description;
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

  const downButton = document.createElement('button');
  downButton.classList.add('down-note');
  downButton.innerHTML = `&lt;`;
  innerDiv.appendChild(downButton);

  const upButton = document.createElement('button');
  upButton.classList.add('up-note');
  upButton.innerHTML = `&lt;`;
  innerDiv.appendChild(upButton);

  addNoteEvents(updateButton, deleteButton, downButton, upButton);
  div.appendChild(innerDiv);
  return div;
}

function addNoteEvents(updateButton, deleteButton, downButton, upButton) {
  updateButton.addEventListener('click', (event) => {
    updateNote(event);
    clickLink("new-note");
  })
  deleteButton.addEventListener('click', (event) => {
    deleteNote(event);
  })
  downButton.addEventListener('click', (event) => {
    changeNotesOrder(event, "down");
  })
  upButton.addEventListener('click', (event) => {
    changeNotesOrder(event, "up");
  })
}

function changeNotesOrder(event, movement) {
  const id = event.target.parentElement.parentElement.id;
  const notes = getNotes();
  const currentNote = notes.findIndex(n => n.id === id);
  if (movement === "down") {
    const downNote = currentNote + 1;
    if (downNote < notes.length) {
      swapElements(notes, currentNote, downNote);
    }
  } else {
    const upNote = currentNote - 1;
    if (upNote > -1) {
      swapElements(notes, currentNote, upNote);
    }
  }
}

function swapElements(notes, currentIndex, targetIndex) {
  let tmp = notes[currentIndex];
  notes[currentIndex] = notes[targetIndex];
  notes[targetIndex] = tmp;
  saveNotes(notes);
  loadNotes();
}

function deleteNote(event) {
  showModal("Do You want to delete this note?", "delete");
  document.getElementById('delete-modal').onclick = function() {
    const note = event.target.parentElement.parentElement;
    document.getElementById('saved-notes').removeChild(note);
    const noteId = event.target.parentElement.parentElement.id;
    let notes = getNotes();
    const updatedArray = notes.filter(note => note.id !== noteId);
    saveNotes(updatedArray);
    updateSection();
    closeModal();
    clickLink("");
  }
}

function downloadNotes() {
  let notes = getNotes();
  let text = ``;
  notes.forEach(note => {
    text += `${note.id}\n${note.title}\n${note.description}\n\n`;
  });
  let file = new Blob([text], { type: 'text/plain' });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(file);
  downloadLink.download = 'MyNotes.txt';
  downloadLink.click();
}

function deleteAllNotes() {
  showModal("Do You want to delete all notes?", "delete");
  document.getElementById('delete-modal').onclick = function() {
    document.getElementById('saved-notes').innerHTML = ``;
    saveNotes([]);
    loadNotes();
    closeModal();
    clickLink("");
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
  document.getElementById('new-note-id').value = '';
}

function showModal(message, type) {
  document.getElementById('modal-message').textContent = message;
  document.getElementById('modal').style.display = "block";
  if (type === "delete") {
    document.getElementById('delete-modal').style.display = "block";
  } else {
    document.getElementById('delete-modal').style.display = "none";
  }
}

function closeModal() {
  document.getElementById('modal').style.display = "none";
}

function clickLink(target) {
  window.location.href = `#${target}`;
}