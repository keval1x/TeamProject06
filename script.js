document.addEventListener('DOMContentLoaded', () => {
    const tasks = [];
    const history = [];

    const todoList = document.getElementById('todo-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const progressBar = document.getElementById('progress-bar-inner');
    const historyLog = document.getElementById('history-log');

    // Section navigation
    const navLinks = document.querySelectorAll('.list-group-item');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-section');
            sections.forEach(section => {
                section.style.display = 'none';
            });
            document.getElementById(target).style.display = 'block';
        });
    });

    // Add Task
    addTaskBtn.addEventListener('click', () => {
        const now = new Date();
        const task = {
            title: '',
            completed: false,
            subtasks: [],
            timestamp: `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`
        };
        tasks.push(task);
        const taskIndex = tasks.length - 1;
        const taskElement = createTaskElement(task, taskIndex);
        todoList.appendChild(taskElement);
    });

    // Create Task Element
    function createTaskElement(task, taskIndex) {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task-item');

        const taskTitle = document.createElement('input');
        taskTitle.type = 'text';
        taskTitle.value = task.title;
        taskTitle.readOnly = task.title !== '';
        taskTitle.classList.add('task-title');
        taskTitle.style.textDecoration = task.completed ? 'line-through' : 'none';

        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('task-buttons');

        const editBtn = document.createElement('button');
        editBtn.classList.add('btn', 'btn-sm', 'btn-secondary', 'edit-task-btn');
        editBtn.textContent = task.title === '' ? 'Save' : 'Edit';
        editBtn.addEventListener('click', () => {
            if (taskTitle.readOnly) {
                taskTitle.readOnly = false;
                taskTitle.focus();
                editBtn.textContent = 'Save';
            } else {
                if (taskTitle.value.trim() === '') {
                    alert('Task title cannot be empty.');
                    taskTitle.focus();
                } else {
                    taskTitle.readOnly = true;
                    task.title = taskTitle.value.trim();
                    editBtn.textContent = 'Edit';
                    addToHistory(`Edited task: ${task.title}`);
                }
            }
        });

        buttonsDiv.appendChild(editBtn);
        taskDiv.appendChild(taskTitle);
        taskDiv.appendChild(buttonsDiv);
        return taskDiv;
    }

    // Formatting Function
    function formatText(command) {
        document.execCommand(command, false, null);
    }

    // History with Timestamps
    function addToHistory(action) {
        const now = new Date();
        const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        history.unshift(`${action} (on ${timestamp})`);
        if (history.length > 25) {
            history.pop();
        }
        renderHistory();
    }

    function renderHistory() {
        historyLog.innerHTML = '';
        history.forEach(entry => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.textContent = entry;
            historyLog.appendChild(listItem);
        });
    }
});
