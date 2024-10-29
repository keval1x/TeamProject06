let tasks = [];
let history = [];

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

function addTask(name) {
    const task = { id: Date.now(), name, subtasks: [], completed: false };
    tasks.push(task);
    history.push(`Added task: ${name}`);
    updateTaskList();
    updateHistoryLog();
}

function updateTaskList() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; 
    tasks.forEach(task => {
        let taskElement = document.createElement('div');
        taskElement.innerHTML = `<p>${task.name}</p>`;
        taskList.appendChild(taskElement);
    });
    updateProgress();
}

function updateHistoryLog() {
    const log = document.getElementById('history-log');
    log.innerHTML = '';
    history.slice(-25).forEach(action => {
        let actionElement = document.createElement('li');
        actionElement.textContent = action;
        log.appendChild(actionElement);
    });
}

function changeTheme(theme) {
    document.body.classList.toggle('dark-theme', theme === 'dark');
}

function changeFont(font) {
    document.body.style.fontFamily = font;
}

function updateProgress() {
    let completedTasks = tasks.filter(task => task.completed).length;
    let progress = (completedTasks / tasks.length) * 100;
    document.getElementById('overall-progress').style.width = `${progress}%`;
}

// Call addTask() to test adding a task
