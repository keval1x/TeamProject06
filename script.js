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
            taskDiv.classList.add('task-item');

            // Task Title
            const taskTitle = document.createElement('input');
            taskTitle.type = 'text';
            taskTitle.value = task.title;
            taskTitle.readOnly = true;
            taskTitle.classList.add('task-title');
            taskTitle.style.textDecoration = task.completed ? 'line-through' : 'none';

            // Buttons Container
            const buttonsDiv = document.createElement('div');
            buttonsDiv.classList.add('task-buttons');

            // Edit Button
            const editBtn = document.createElement('button');
            editBtn.classList.add('btn', 'btn-sm', 'btn-secondary');
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => {
                if (taskTitle.readOnly) {
                    taskTitle.readOnly = false;
                    taskTitle.focus();
                    editBtn.textContent = 'Save';
                } else {
                    taskTitle.readOnly = true;
                    task.title = taskTitle.value;
                    editBtn.textContent = 'Edit';
                    addToHistory(`Edited task: ${task.title}`);
                }
            });

            // Delete Button
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('btn', 'btn-sm', 'btn-danger');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                tasks.splice(taskIndex, 1);
                addToHistory(`Deleted task: ${task.title}`);
                renderTasks();
                updateProgress();
            });

            // Complete Button
            const completeBtn = document.createElement('button');
            completeBtn.classList.add('btn', 'btn-sm', 'btn-success');
            completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
            completeBtn.addEventListener('click', () => {
                task.completed = !task.completed;
                taskTitle.style.textDecoration = task.completed ? 'line-through' : 'none';
                completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
                addToHistory(`Task ${task.completed ? 'completed' : 'uncompleted'}: ${task.title}`);
                updateProgress();
            });

            // Add Subtask Button
            const addSubtaskBtn = document.createElement('button');
            addSubtaskBtn.classList.add('btn', 'btn-sm', 'btn-primary');
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

            // Append buttons to the buttons container
            buttonsDiv.appendChild(editBtn);
            buttonsDiv.appendChild(deleteBtn);
            buttonsDiv.appendChild(completeBtn);
            buttonsDiv.appendChild(addSubtaskBtn);

            // Append title and buttons to task item
            taskDiv.appendChild(taskTitle);
            taskDiv.appendChild(buttonsDiv);

            // Subtasks
            if (task.subtasks.length > 0) {
                const subtaskList = document.createElement('div');
                subtaskList.classList.add('subtask-list', 'ml-4', 'mt-2');

                task.subtasks.forEach((subtask, subtaskIndex) => {
                    const subtaskDiv = document.createElement('div');
                    subtaskDiv.classList.add('task-item');

                    const subtaskTitle = document.createElement('input');
                    subtaskTitle.type = 'text';
                    subtaskTitle.value = subtask.title;
                    subtaskTitle.readOnly = true;
                    subtaskTitle.style.textDecoration = subtask.completed ? 'line-through' : 'none';

                    const subtaskButtonsDiv = document.createElement('div');
                    subtaskButtonsDiv.classList.add('task-buttons');

                    // Edit Subtask Button
                    const editSubtaskBtn = document.createElement('button');
                    editSubtaskBtn.classList.add('btn', 'btn-sm', 'btn-secondary');
                    editSubtaskBtn.textContent = 'Edit';
                    editSubtaskBtn.addEventListener('click', () => {
                        if (subtaskTitle.readOnly) {
                            subtaskTitle.readOnly = false;
                            subtaskTitle.focus();
                            editSubtaskBtn.textContent = 'Save';
                        } else {
                            subtaskTitle.readOnly = true;
                            subtask.title = subtaskTitle.value;
                            editSubtaskBtn.textContent = 'Edit';
                            addToHistory(`Edited subtask: ${subtask.title}`);
                        }
                    });

                    // Delete Subtask Button
                    const deleteSubtaskBtn = document.createElement('button');
                    deleteSubtaskBtn.classList.add('btn', 'btn-sm', 'btn-danger');
                    deleteSubtaskBtn.textContent = 'Delete';
                    deleteSubtaskBtn.addEventListener('click', () => {
                        task.subtasks.splice(subtaskIndex, 1);
                        addToHistory(`Deleted subtask: ${subtask.title}`);
                        renderTasks();
                        updateProgress();
                    });

                    // Complete Subtask Button
                    const completeSubtaskBtn = document.createElement('button');
                    completeSubtaskBtn.classList.add('btn', 'btn-sm', 'btn-success');
                    completeSubtaskBtn.textContent = subtask.completed ? 'Undo' : 'Complete';
                    completeSubtaskBtn.addEventListener('click', () => {
                        subtask.completed = !subtask.completed;
                        subtaskTitle.style.textDecoration = subtask.completed ? 'line-through' : 'none';
                        completeSubtaskBtn.textContent = subtask.completed ? 'Undo' : 'Complete';
                        addToHistory(`Subtask ${subtask.completed ? 'completed' : 'uncompleted'}: ${subtask.title}`);
                        checkTaskCompletion(task);
                        updateProgress();
                    });

                    // Append subtask buttons
                    subtaskButtonsDiv.appendChild(editSubtaskBtn);
                    subtaskButtonsDiv.appendChild(deleteSubtaskBtn);
                    subtaskButtonsDiv.appendChild(completeSubtaskBtn);

                    // Append subtask title and buttons
                    subtaskDiv.appendChild(subtaskTitle);
                    subtaskDiv.appendChild(subtaskButtonsDiv);

                    subtaskList.appendChild(subtaskDiv);
                });

                taskDiv.appendChild(subtaskList);
            }

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

