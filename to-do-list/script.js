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

    function renderTasks() {
        tasksList.innerHTML = tasks.map((task, index) => {
            const subtasksHTML = task.subtasks.map((subtask, subIndex) => `
                <li>
                    <input type="checkbox" ${subtask.completed ? 'checked' : ''} 
                        onclick="toggleSubtask(${index}, ${subIndex})"> ${subtask.text}
                </li>
            `).join('');
            
            const taskProgress = task.subtasks.length 
                ? (task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100 
                : 0;

            return `
                <li class="list-group-item">
                    <span>${task.text}</span>
                    <button onclick="deleteTask(${index})">Delete</button>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" style="width: ${taskProgress}%"></div>
                    </div>
                    <ul>${subtasksHTML}</ul>
                    <input type="text" placeholder="Add subtask">
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
});

