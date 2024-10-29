// Task and history data storage
let tasks = [];
let history = [];

// Navigation: show or hide sections
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// To-Do List: Add a task with an optional subtask array
function addTask(name) {
    const task = { id: Date.now(), name, subtasks: [], completed: false };
    tasks.push(task);
    addHistory(`Added task: ${name}`);
    updateTaskList();
    updateProgress();
}

function addSubtask(taskId, subtaskName) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        const subtask = { id: Date.now(), name: subtaskName, completed: false };
        task.subtasks.push(subtask);
        addHistory(`Added subtask: ${subtaskName} to task: ${task.name}`);
        updateTaskList();
        updateProgress();
    }
}

function toggleCompleteTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        addHistory(`Marked task "${task.name}" as ${task.completed ? 'completed' : 'incomplete'}`);
        updateTaskList();
        updateProgress();
    }
}

function toggleCompleteSubtask(taskId, subtaskId) {
    const task = tasks.find(t => t.id === taskId);
    const subtask = task.subtasks.find(st => st.id === subtaskId);
    if (subtask) {
        subtask.completed = !subtask.completed;
        addHistory(`Marked subtask "${subtask.name}" as ${subtask.completed ? 'completed' : 'incomplete'}`);
        updateTaskList();
        updateProgress();
    }
    // Automatically complete task if all subtasks are completed
    task.completed = task.subtasks.every(st => st.completed);
}

function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    addHistory(`Deleted task with ID: ${taskId}`);
    updateTaskList();
    updateProgress();
}

function updateTaskList() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; 

    tasks.forEach(task => {
        let taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.innerHTML = `
            <p>${task.name}</p>
            <button onclick="toggleCompleteTask(${task.id})">Complete</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
            <button onclick="addSubtaskPrompt(${task.id})">Add Subtask</button>
        `;

        task.subtasks.forEach(subtask => {
            const subtaskElement = document.createElement('div');
            subtaskElement.classList.add('subtask');
            subtaskElement.innerHTML = `
                <p>${subtask.name}</p>
                <button onclick="toggleCompleteSubtask(${task.id}, ${subtask.id})">Complete</button>
            `;
            taskElement.appendChild(subtaskElement);
        });

        taskList.appendChild(taskElement);
    });
}

function addSubtaskPrompt(taskId) {
    const subtaskName = prompt("Enter the subtask name:");
    if (subtaskName) {
        addSubtask(taskId, subtaskName);
    }
}

function updateProgress() {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    document.getElementById('overall-progress').style.width = `${progress}%`;
}

// History Log: Track the last 25 actions
function addHistory(action) {
    history.push(action);
    if (history.length > 25) history.shift();
    updateHistoryLog();
}

function updateHistoryLog() {
    const log = document.getElementById('history-log');
    log.innerHTML = '';
    history.forEach(action => {
        const actionElement = document.createElement('li');
        actionElement.textContent = action;
        log.appendChild(actionElement);
    });
}

// Design: Change theme and font
function changeTheme(theme) {
    document.body.classList.toggle('dark-theme', theme === 'dark');
}

function changeFont(font) {
    document.body.style.fontFamily = font;
}

// Prompt user to add a new task
function addTaskPrompt() {
    const taskName = prompt("Enter the task name:");
    if (taskName) {
        addTask(taskName);
    }
}

// Initialize - example task for demonstration
addTask("Sample Task");
addSubtask(tasks[0].id, "Sample Subtask");

document.getElementById("todo").style.display = "block";  // Default to showing the To-Do list section
