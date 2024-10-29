function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = section.id === sectionId ? 'block' : 'none';
        section.classList.toggle('active', section.id === sectionId);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const taskInput = document.getElementById("taskInput");
    const addTaskButton = document.getElementById("addTaskButton");
    const tasksList = document.getElementById("tasks");
    const historyLog = document.getElementById("history");
    const overallProgress = document.getElementById("overallProgress");

    let tasks = [];
    let history = [];

    function updateHistory(action) {
        history.unshift(action);
        if (history.length > 20) history.pop();

        historyLog.innerHTML = history.map(item => `<li>${item}</li>`).join('');
    }

    function updateProgress() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
        
        overallProgress.style.width = `${progress}%`;
        overallProgress.innerText = `${Math.round(progress)}%`;
    }

    function addTask(taskText) {
        const task = { text: taskText, completed: false, subtasks: [] };
        tasks.push(task);
        renderTasks();
        updateHistory(`Added task: "${taskText}"`);
    }

    function deleteTask(index) {
        const task = tasks.splice(index, 1)[0];
        renderTasks();
        updateHistory(`Deleted task: "${task.text}"`);
    }

    function toggleTaskCompletion(index) {
        tasks[index].completed = !tasks[index].completed;
        renderTasks();
        updateHistory(`Marked task "${tasks[index].text}" as ${tasks[index].completed ? "Done" : "Not Done"}`);
    }

    function addSubtask(taskIndex, subtaskText = "New Subtask") {
        const subtask = { text: subtaskText, completed: false };
        tasks[taskIndex].subtasks.push(subtask);
        renderTasks();
        updateHistory(`Added subtask: "${subtaskText}" to task "${tasks[taskIndex].text}"`);
    }

    function editTask(taskIndex) {
        const newTaskText = prompt("Edit Task:", tasks[taskIndex].text);
        if (newTaskText) {
            tasks[taskIndex].text = newTaskText;
            renderTasks();
            updateHistory(`Edited task: "${newTaskText}"`);
        }
    }

    function renderTasks() {
        tasksList.innerHTML = tasks.map((task, index) => {
            const subtasksHTML = task.subtasks.map((subtask, subIndex) => `
                <li class="subtask">
                    <div style="display: flex; align-items: center;">
                        <button class="done-button" onclick="toggleSubtask(${index}, ${subIndex})">
                            ${subtask.completed ? "Undo" : "Done"}
                        </button>
                        <span>${subtask.text}</span>
                    </div>
                </li>
            `).join('');

            return `
                <li class="list-group-item">
                    <div style="display: flex; align-items: center;">
                        <button class="done-button" onclick="toggleTaskCompletion(${index})">
                            ${task.completed ? "Undo" : "Done"}
                        </button>
                        <button class="edit-button" onclick="editTask(${index})">Edit</button>
                        <button class="delete-button" onclick="deleteTask(${index})">Delete</button>
                        <button class="add-subtask-button" onclick="addSubtask(${index})">Add Subtask</button>
                        <span style="margin-left: 10px;">${task.text}</span>
                    </div>
                    <ul>${subtasksHTML}</ul>
                </li>
            `;
        }).join('');
        updateProgress();
    }

    addTaskButton.addEventListener("click", function() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            taskInput.value = "";
        }
    });

    window.deleteTask = deleteTask;
    window.toggleTaskCompletion = toggleTaskCompletion;
    window.addSubtask = addSubtask;
});

