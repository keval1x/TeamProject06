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
        const task = tasks[taskIndex];
        const taskElement = document.querySelector(`#task-${taskIndex} .task-text`);
        const input = document.createElement("input");
        input.type = "text";
        input.value = task.text;
        input.classList.add("form-control");
       
        // Save on blur or Enter key
        input.addEventListener("blur", () => saveEdit(taskIndex, input.value));
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") saveEdit(taskIndex, input.value);
        });

        // Replace text with input field
        taskElement.innerHTML = "";
        taskElement.appendChild(input);
        input.focus();
    }

    function saveEdit(taskIndex, newText) {
        tasks[taskIndex].text = newText;
        renderTasks();
        updateHistory(`Edited task: "${newText}"`);
    }

    function renderTasks() {
        // Auto-complete task if all subtasks are done
        tasks.forEach((task, index) => {
            if (task.subtasks.length > 0 && task.subtasks.every(subtask => subtask.completed)) {
                task.completed = true;
            }
        });

        tasksList.innerHTML = tasks.map((task, index) => {
            const subtasksHTML = task.subtasks.map((subtask, subIndex) => `
                <li class="subtask">
                    <div class="subtask-content">
                        <span>${subtask.text}</span>
                    </div>
                </li>
            `).join('');

            return `
                <li class="list-group-item" id="task-${index}">
                    <div class="task-content">
                        <span class="task-text">${task.text}</span>
                        <div class="task-buttons">
                            <button class="add-subtask-button" onclick="addSubtask(${index})">Add Subtask</button>
                            <button class="edit-button" onclick="editTask(${index})">Edit</button>
                            <button class="done-button" onclick="toggleTaskCompletion(${index})">
                                ${task.completed ? "Undo" : "Done"}
                            </button>
                            <button class="delete-button" onclick="deleteTask(${index})">Delete</button>
                        </div>
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
    window.editTask = editTask;
});
