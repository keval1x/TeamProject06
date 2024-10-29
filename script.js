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
        const taskTitle = prompt('Enter task title:');
        if (taskTitle) {
            const task = {
                title: taskTitle,
                completed: false,
                subtasks: []
            };
            tasks.push(task);
            addToHistory(`Added task: ${taskTitle}`);
            renderTasks();
            updateProgress();
        }
    });

    // Render Tasks
    function renderTasks() {
        todoList.innerHTML = '';
        tasks.forEach((task, taskIndex) => {
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('card', 'mb-2');

            const taskHeader = document.createElement('div');
            taskHeader.classList.add('card-header', 'd-flex', 'justify-content-between', 'align-items-center');

            const taskTitle = document.createElement('input');
            taskTitle.type = 'text';
            taskTitle.value = task.title;
            taskTitle.classList.add('form-control', 'mr-2');
            taskTitle.addEventListener('change', () => {
                task.title = taskTitle.value;
                addToHistory(`Edited task: ${task.title}`);
            });

            const taskCheckbox = document.createElement('input');
            taskCheckbox.type = 'checkbox';
            taskCheckbox.checked = task.completed;
            taskCheckbox.classList.add('mr-2');
            taskCheckbox.addEventListener('change', () => {
                task.completed = taskCheckbox.checked;
                addToHistory(`Task ${task.completed ? 'completed' : 'uncompleted'}: ${task.title}`);
                updateProgress();
            });

            const removeTaskBtn = document.createElement('button');
            removeTaskBtn.classList.add('btn', 'btn-danger', 'btn-sm');
            removeTaskBtn.textContent = 'Remove';
            removeTaskBtn.addEventListener('click', () => {
                tasks.splice(taskIndex, 1);
                addToHistory(`Removed task: ${task.title}`);
                renderTasks();
                updateProgress();
            });

            taskHeader.appendChild(taskCheckbox);
            taskHeader.appendChild(taskTitle);
            taskHeader.appendChild(removeTaskBtn);

            // Subtasks
            const subtaskList = document.createElement('ul');
            subtaskList.classList.add('list-group', 'list-group-flush');

            task.subtasks.forEach((subtask, subtaskIndex) => {
                const subtaskItem = document.createElement('li');
                subtaskItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

                const subtaskTitle = document.createElement('input');
                subtaskTitle.type = 'text';
                subtaskTitle.value = subtask.title;
                subtaskTitle.classList.add('form-control', 'mr-2');
                subtaskTitle.addEventListener('change', () => {
                    subtask.title = subtaskTitle.value;
                    addToHistory(`Edited subtask: ${subtask.title}`);
                });

                const subtaskCheckbox = document.createElement('input');
                subtaskCheckbox.type = 'checkbox';
                subtaskCheckbox.checked = subtask.completed;
                subtaskCheckbox.classList.add('mr-2');
                subtaskCheckbox.addEventListener('change', () => {
                    subtask.completed = subtaskCheckbox.checked;
                    addToHistory(`Subtask ${subtask.completed ? 'completed' : 'uncompleted'}: ${subtask.title}`);
                    checkTaskCompletion(task);
                    updateProgress();
                });

                const removeSubtaskBtn = document.createElement('button');
                removeSubtaskBtn.classList.add('btn', 'btn-danger', 'btn-sm');
                removeSubtaskBtn.textContent = 'Remove';
                removeSubtaskBtn.addEventListener('click', () => {
                    task.subtasks.splice(subtaskIndex, 1);
                    addToHistory(`Removed subtask: ${subtask.title}`);
                    renderTasks();
                    updateProgress();
                });

                subtaskItem.appendChild(subtaskCheckbox);
                subtaskItem.appendChild(subtaskTitle);
                subtaskItem.appendChild(removeSubtaskBtn);
                subtaskList.appendChild(subtaskItem);
            });

            const addSubtaskBtn = document.createElement('button');
            addSubtaskBtn.classList.add('btn', 'btn-secondary', 'btn-sm', 'mt-2');
            addSubtaskBtn.textContent = 'Add Subtask';
            addSubtaskBtn.addEventListener('click', () => {
                const subtaskTitle = prompt('Enter subtask title:');
                if (subtaskTitle) {
                    const subtask = {
                        title: subtaskTitle,
                        completed: false
                    };
                    task.subtasks.push(subtask);
                    addToHistory(`Added subtask: ${subtaskTitle}`);
                    renderTasks();
                    updateProgress();
                }
            });

            const taskBody = document.createElement('div');
            taskBody.classList.add('card-body');
            taskBody.appendChild(subtaskList);
            taskBody.appendChild(addSubtaskBtn);

            taskDiv.appendChild(taskHeader);
            taskDiv.appendChild(taskBody);
            todoList.appendChild(taskDiv);
        });
    }

    // Check if all subtasks are completed to complete the task
    function checkTaskCompletion(task) {
        if (task.subtasks.length > 0) {
            task.completed = task.subtasks.every(subtask => subtask.completed);
            renderTasks();
            updateProgress();
        }
    }

    // Update Progress Bar
    function updateProgress() {
        const totalItems = tasks.length + tasks.reduce((acc, task) => acc + task.subtasks.length, 0);
        const completedItems = tasks.filter(task => task.completed).length + tasks.reduce((acc, task) => acc + task.subtasks.filter(subtask => subtask.completed).length, 0);

        const progressPercentage = totalItems === 0 ? 0 : (completedItems / totalItems) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    // Add to History Log
    function addToHistory(action) {
        history.unshift(action);
        if (history.length > 25) {
            history.pop();
        }
        renderHistory();
    }

    // Render History Log
    function renderHistory() {
        historyLog.innerHTML = '';
        history.forEach(entry => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.textContent = entry;
            historyLog.appendChild(listItem);
        });
    }

    // Design Section Handlers
    const colorSchemeSelect = document.getElementById('color-scheme');
    const fontSelect = document.getElementById('font-select');

    colorSchemeSelect.addEventListener('change', () => {
        document.body.className = '';
        const scheme = colorSchemeSelect.value;
        if (scheme !== 'default') {
            document.body.classList.add(`${scheme}-theme`);
        }
        addToHistory(`Changed color scheme to ${scheme}`);
    });

    fontSelect.addEventListener('change', () => {
        document.body.style.fontFamily = fontSelect.value;
        addToHistory(`Changed font to ${fontSelect.options[fontSelect.selectedIndex].text}`);
    });
});

