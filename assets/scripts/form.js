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
    note.classList.add('saved-note');
    note.innerHTML = `
      <p class="saved-note-date"><em>${date}</em></p>
      <p class="saved-note-title"><strong>${title}</strong></p>
      <p class="saved-note-description">${description}</p>
    `;
    notes.appendChild(note);
    resetNote();
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

updateTitle();