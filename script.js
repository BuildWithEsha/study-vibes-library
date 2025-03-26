function addNewButton() {
    const name = prompt("Enter a name for the new button:");

    if (name && name.trim() !== "") {
        const newButton = document.createElement('a');
        newButton.classList.add('bt');
        newButton.href = "#";

        newButton.addEventListener('click', function (e) {
            e.preventDefault();
            showTaskBox(name);
        });


        const paperclip = document.createElement('i');
        paperclip.classList.add('fas', 'fa-paperclip');

        const text = document.createTextNode(` ${name} `);

        const trash = document.createElement('i');
        trash.classList.add('fas', 'fa-trash', 'trash-icon');
        trash.style.marginLeft = 'auto';
        trash.style.cursor = 'pointer';
        trash.addEventListener('click', (e) => {
        e.preventDefault(); // prevent link from triggering
        newButton.remove();
        });

        newButton.appendChild(paperclip);
        newButton.appendChild(text);
        newButton.appendChild(trash);

        const rows = document.querySelectorAll('.button-row');
        let lastRow = rows[rows.length - 1];

        if (lastRow.children.length >= 3) {
        lastRow = document.createElement('div');
        lastRow.classList.add('button-row');
        document.querySelector('.buttons').insertBefore(lastRow, document.querySelector('.add-button-container'));
        }

        lastRow.appendChild(newButton);
    }
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
        const title = prompt("Resource Title:");
        const description = prompt("Brief Description:");
        const link = prompt("URL Link:");

        if (title && link) {
            const resource = { title, description, link };
            addResourceToList(resource, category);
            saveResource(resource, category);
        }
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
                ${isPersonal ? `<i class="fas fa-trash mini-trash"></i>` : ''}
            </div>
        `;
    
        const bookmarkIcon = li.querySelector('.save-icon');
        bookmarkIcon.onclick = () => {
            toggleSave(bookmarkIcon, resource.title, resource.description, resource.link);
        };
    
        if (isPersonal) {
            const trashIcon = li.querySelector('.mini-trash');
            trashIcon.onclick = () => {
                deleteResource(trashIcon, category, resource.link);
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

    function loadResources(category) {
        const personalResources = JSON.parse(localStorage.getItem(category) || "[]");

        const sharedDefaults = {
            'LOFI': [
            {
                title: "Lofi Girl",
                description: "Relaxing 24/7 lofi hip hop radio",
                link: "https://www.youtube.com/watch?v=jfKfPfyJRdk"
            },
            {
                title: "Chillhop Music",
                description: "Chillhop beats to study and relax to",
                link: "https://chillhop.com/"
            },
            {
                title: "College Music",
                description: "Live lofi & chillhop radio",
                link: "https://www.youtube.com/@CollegeMusic"
            }
            ],

            'TECHNIQUES': [
            {
                title: "Pomodoro Technique",
                description: "Work in 25-minute bursts with short breaks",
                link: "https://todoist.com/productivity-methods/pomodoro-technique"
            },
            {
                title: "Active Recall",
                description: "Boost memory by testing yourself",
                link: "https://www.youtube.com/watch?v=ukLnPbIffxE"
            },
            {
                title: "Spaced Repetition",
                description: "Review info at spaced intervals for long-term memory",
                link: "https://apps.ankiweb.net/"
            },
            {
                title: "Feynman Technique",
                description: "Learn deeply by teaching concepts in simple terms",
                link: "https://fs.blog/feynman-technique/"
            }
            ],

            'TOOLS': [
            {
                title: "Notion",
                description: "All-in-one workspace for notes and planning",
                link: "https://www.notion.so/"
            },
            {
                title: "Obsidian",
                description: "Markdown-based note-taking app",
                link: "https://obsidian.md/"
            },
            {
                title: "Trello",
                description: "Kanban-style task management tool",
                link: "https://trello.com/"
            },
            {
                title: "Anki",
                description: "Powerful flashcard system using spaced repetition",
                link: "https://apps.ankiweb.net/"
            }
            ],

            'SOUNDS': [
            {
                title: "Rainy Mood",
                description: "Rain sounds for deep focus and calm",
                link: "https://rainymood.com/"
            },
            {
                title: "Noisli",
                description: "Custom background noise for productivity",
                link: "https://www.noisli.com/"
            },
            {
                title: "Coffitivity",
                description: "Café background sounds to boost creativity",
                link: "https://coffitivity.com/"
            }
            ],


            'POMODORO': [
            {
                title: "Pomofocus",
                description: "Customizable Pomodoro timer web app",
                link: "https://pomofocus.io/"
            },
            {
                title: "Tomato Timer",
                description: "Simple online Pomodoro countdown",
                link: "https://tomato-timer.com/"
            },
            {
                title: "Forest App",
                description: "Stay focused by growing a virtual tree",
                link: "https://forestapp.cc/"
            }
            ]

        };

    
        if (sharedDefaults[category]) {
            sharedDefaults[category].forEach(resource => addResourceToList(resource, category, false));
        }

       
        personalResources.forEach(resource => addResourceToList(resource, category, true));
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



    document.addEventListener('click', function (e) {
    const taskBox = document.querySelector('.task-box');
    if (taskBox && !taskBox.contains(e.target) && !e.target.classList.contains('bt')) {
        taskBox.remove();
    }
    });

