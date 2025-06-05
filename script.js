let suppressOutsideClick = false;

function createModal(title, fields, callback) {
  const container = document.getElementById('modal-container');
  container.innerHTML = '';

  const modal = document.createElement('div');
  modal.className = 'modal-box';

  modal.innerHTML = `
    <div class="task-header">${title}</div>
    <div style="padding: 10px;">
      ${fields.map(field => `
        <label>${field.label}</label>
        <input id="modal-${field.name}" type="text" placeholder="${field.placeholder}" style="margin-bottom:10px;width:100%;" />
      `).join('')}
      <button class="add-task-btn" id="modal-submit">Submit</button>
    </div>
  `;

  suppressOutsideClick = true;
  container.appendChild(modal);
  setTimeout(() => {
    suppressOutsideClick = false;
  }, 0);

  document.getElementById('modal-submit').onclick = function () {
    const values = {};
    for (const field of fields) {
      values[field.name] = document.getElementById(`modal-${field.name}`).value.trim();
    }
    container.innerHTML = '';
    callback(values);
  };
}

function outsideClickHandler(e) {
  if (suppressOutsideClick) return;

  const taskBox = document.querySelector('.task-box');
  const modal = document.querySelector('.modal-box');

  const clickedInsideTaskBox = taskBox && taskBox.contains(e.target);
  const clickedInsideModal = modal && modal.contains(e.target);
  const clickedButton = e.target.classList.contains('bt') || e.target.closest('.bt');
  const clickedAddTaskBtn = e.target.classList.contains('add-task-btn');

  if (taskBox && !clickedInsideTaskBox && !clickedInsideModal && !clickedButton) {
    taskBox.remove();
  }

  if (modal && !clickedInsideModal && !clickedAddTaskBtn && !clickedInsideTaskBox) {
    modal.remove();
  }
}

function addNewButton() {
  createModal("Add New Category", [
    { name: "name", label: "Category Name", placeholder: "e.g. Mindset" }
  ], ({ name }) => {
    if (!name) return;

    const newButton = document.createElement('a');
    newButton.classList.add('bt');
    newButton.href = "#";
    newButton.innerHTML = `<i class="fas fa-paperclip"></i> ${name}`;

    newButton.addEventListener('click', e => {
      e.preventDefault();
      showTaskBox(name);
    });

    const trash = document.createElement('i');
    trash.classList.add('fas', 'fa-trash', 'trash-icon');
    trash.addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();
      newButton.remove();
      localStorage.removeItem(name);
    });

    newButton.appendChild(trash);

    const rows = document.querySelectorAll('.button-row');
    let lastRow = rows[rows.length - 2];
    if (lastRow.children.length >= 3) {
      lastRow = document.createElement('div');
      lastRow.classList.add('button-row');
      document.querySelector('.buttons').insertBefore(lastRow, document.querySelector('.button-row:last-of-type'));
    }

    lastRow.appendChild(newButton);
  });
}

function showTaskBox(category) {
  const existing = document.querySelector('.task-box');
  if (existing) existing.remove();

  const taskBox = document.createElement('div');
  taskBox.classList.add('task-box');
  taskBox.innerHTML = `
    <div class='task-header'>${category}</div>
    <div class='task-list'>
      <ul id='taskList'></ul>
      <button class='add-task-btn'>Add Resource</button>
    </div>
  `;

  document.body.appendChild(taskBox);
  loadResources(category);

  taskBox.querySelector('.add-task-btn').onclick = () => {
    createModal("Add Resource", [
      { name: "title", label: "Title", placeholder: "e.g. Lofi Girl" },
      { name: "description", label: "Description", placeholder: "Optional" },
      { name: "link", label: "Link", placeholder: "https://..." }
    ], ({ title, description, link }) => {
      if (title && link) {
        const resource = { title, description, link };
        addResourceToList(resource, category, true);
        saveResource(resource, category);
      }
    });
  };
}

function addResourceToList(resource, category, isPersonal) {
  const favorites = JSON.parse(localStorage.getItem("FAVORITES") || "[]");
  const isSaved = favorites.some(fav => fav.link === resource.link);

  const li = document.createElement('li');
  li.innerHTML = `
    <strong>${resource.title}</strong>
    <span>${resource.description || ''}</span>
    <a href="${resource.link}" target="_blank">Visit →</a>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
      <i class="${isSaved ? 'fa-solid saved' : 'fa-regular'} fa-bookmark save-icon"></i>
      ${isPersonal ? `<i class="fas fa-trash mini-trash" style="cursor:pointer;"></i>` : ''}
    </div>
  `;

  li.querySelector('.save-icon').onclick = () => {
    toggleSave(li.querySelector('.save-icon'), resource.title, resource.description, resource.link);
  };

  if (isPersonal) {
    li.querySelector('.mini-trash').onclick = () => {
      deleteResource(li.querySelector('.mini-trash'), category, resource.link);
    };
  }

  document.querySelector('#taskList').appendChild(li);
}

function deleteResource(el, category, link) {
  const resources = JSON.parse(localStorage.getItem(category) || "[]");
  const updated = resources.filter(res => res.link !== link);
  localStorage.setItem(category, JSON.stringify(updated));
  el.closest('li').remove();
}

function toggleSave(el, title, description, link) {
  const isSaved = el.classList.contains('saved');

  if (!isSaved) {
    markFavorite(title, description, link);
    el.classList.add('fa-solid', 'saved');
    el.classList.remove('fa-regular');
  } else {
    el.classList.remove('fa-solid', 'saved');
    el.classList.add('fa-regular');
  }
}

function saveResource(resource, category) {
  const resources = JSON.parse(localStorage.getItem(category) || "[]");
  resources.push(resource);
  localStorage.setItem(category, JSON.stringify(resources));
}

function markFavorite(title, description, link) {
  const favorite = { title, description, link };
  const favorites = JSON.parse(localStorage.getItem("FAVORITES") || "[]");

  if (!favorites.some(fav => fav.link === link)) {
    favorites.push(favorite);
    localStorage.setItem("FAVORITES", JSON.stringify(favorites));
    alert("Resource added to favorites!");
  } else {
    alert("Resource is already in favorites.");
  }
}

function loadResources(category) {
  const personal = JSON.parse(localStorage.getItem(category) || "[]");

  const sharedDefaults = {
    'LOFI': [
      { title: "Lofi Girl", description: "24/7 lofi hip hop", link: "https://www.youtube.com/watch?v=jfKfPfyJRdk" },
      { title: "Chillhop Music", description: "Study beats", link: "https://chillhop.com/" },
      { title: "College Music", description: "Live lofi", link: "https://www.youtube.com/@CollegeMusic" }
    ],
    'TECHNIQUES': [
      { title: "Pomodoro", description: "25-min focus", link: "https://todoist.com/productivity-methods/pomodoro-technique" },
      { title: "Active Recall", description: "Test yourself", link: "https://www.youtube.com/watch?v=ukLnPbIffxE" },
      { title: "Spaced Repetition", description: "Interval review", link: "https://apps.ankiweb.net/" },
      { title: "Feynman", description: "Teach what you learn", link: "https://fs.blog/feynman-technique/" }
    ],
    'TOOLS': [
      { title: "Notion", description: "All-in-one notes", link: "https://www.notion.so/" },
      { title: "Obsidian", description: "Markdown notes", link: "https://obsidian.md/" },
      { title: "Trello", description: "Kanban tasks", link: "https://trello.com/" },
      { title: "Anki", description: "Spaced repetition flashcards", link: "https://apps.ankiweb.net/" }
    ],
    'SOUNDS': [
      { title: "Rainy Mood", description: "Rain sounds", link: "https://rainymood.com/" },
      { title: "Noisli", description: "Background sounds", link: "https://www.noisli.com/" },
      { title: "Coffitivity", description: "Cafe ambience", link: "https://coffitivity.com/" }
    ],
    'POMODORO': [
      { title: "Pomofocus", description: "Pomodoro timer", link: "https://pomofocus.io/" },
      { title: "Tomato Timer", description: "Basic countdown", link: "https://tomato-timer.com/" },
      { title: "Forest", description: "Grow trees while focusing", link: "https://forestapp.cc/" }
    ]
  };

  if (sharedDefaults[category]) {
    sharedDefaults[category].forEach(res => addResourceToList(res, category, false));
  }

  personal.forEach(res => addResourceToList(res, category, true));
}

function exportData() {
  const data = {};
  Object.keys(localStorage).forEach(key => {
    data[key] = JSON.parse(localStorage.getItem(key));
  });
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "study-vibes-library.json";
  a.click();
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      for (const key in data) {
        localStorage.setItem(key, JSON.stringify(data[key]));
      }
      alert("Data imported! Refresh the page.");
    } catch {
      alert("Import failed: Invalid format.");
    }
  };
  reader.readAsText(file);
}

window.onload = function () {
  document.querySelectorAll('.add').forEach(btn => {
    if (!btn.onclick) {
      btn.addEventListener('click', addNewButton);
    }
  });

  // Global click listener to close modal or task box
  document.addEventListener('click', outsideClickHandler);
};
