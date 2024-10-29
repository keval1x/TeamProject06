function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = section.id === sectionId ? 'block' : 'none';
        section.classList.toggle('active', section.id === sectionId);
    });
}

window.showSection = showSection;

document.addEventListener("DOMContentLoaded", function() {
    const taskInput = document.getElementById("taskInput");
    const addTaskButton = document.getElementById("addTaskButton");
    const tasksList = document.getElementById("tasks");
    const historyLog = document.getElementById("history");
    const overallProgress = document.getElementById("overallProgress");

    const username = "Alice";  // Example username, can be dynamic
    const role = "Manager";    // Or "Employee", set this dynamically
    document.getElementById("username").innerText = username;
    document.getElementById("role").innerText = role;

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

    function addSubtask(taskIndex, subtaskText) {
        const subtask = { text: subtaskText, completed: false, subtasks: [] };
        tasks[taskIndex].subtasks.push(subtask);
        renderTasks();
        updateHistory(`Added subtask: "${subtaskText}" to task "${tasks[taskIndex].text}"`);
    }
    

    function toggleSubtask(taskIndex, subtaskIndex) {
        const subtask = tasks[taskIndex].subtasks[subtaskIndex];
        subtask.completed = !subtask.completed;
        renderTasks();
        updateHistory(`Marked subtask "${subtask.text}" as ${subtask.completed ? "Done" : "Not Done"}`);
    }

    function editTask(taskIndex) {
        const task = tasks[taskIndex];
        const newText = prompt("Edit Task:", task.text);
        if (newText) {
            task.text = newText;
            renderTasks();
            updateHistory(`Edited task: "${newText}"`);
        }
    }

    function editSubtask(taskIndex, subtaskIndex) {
        const subtask = tasks[taskIndex].subtasks[subtaskIndex];
        const newText = prompt("Edit Subtask:", subtask.text);
        if (newText) {
            subtask.text = newText;
            renderTasks();
            updateHistory(`Edited subtask: "${newText}"`);
        }
    }

    function renderTasks(taskList = tasks, indentLevel = 0) {
        tasksList.innerHTML = taskList.map((task, index) => {
            const subtasksHTML = task.subtasks.map((subtask, subIndex) => `
                <li class="subtask" style="margin-left: ${20 * indentLevel}px;">
                    ${subtask.text}
                    <button class="done-button" onclick="toggleSubtask(${index}, ${subIndex})">
                        ${subtask.completed ? "Undo" : "Done"}
                    </button>
                    <button class="edit-button" onclick="editSubtask(${index}, ${subIndex})">Edit</button>
                    <button class="delete-button" onclick="deleteSubtask(${index}, ${subIndex})">Delete</button>
                    <button class="add-subtask" onclick="addSubtask(${index}, '')">Add Subtask</button>
                    ${renderTasks(subtask.subtasks, indentLevel + 1)}
                </li>
            `).join('');
            
            const taskProgress = task.subtasks.length 
                ? (task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100 
                : 0;

            return `
                <li class="list-group-item">
                    <span>${task.text}</span>
                    <button class="done-button" onclick="toggleTaskCompletion(${index})">
                        ${task.completed ? "Undo" : "Done"}
                    </button>
                    <button class="edit-button" onclick="editTask(${index})">Edit</button>
                    <button class="delete-button" onclick="deleteTask(${index})">Delete</button>
                    <button class="add-subtask" onclick="addSubtask(${index}, '')">Add Subtask</button>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" style="width: ${taskProgress}%"></div>
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
    window.editSubtask = editSubtask;
});


