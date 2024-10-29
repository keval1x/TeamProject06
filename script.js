let tasks = [];
let history = [];

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}

function addTask() {
    const taskId = `task-${Date.now()}`;
    tasks.push({ id: taskId, subtasks: [], completed: false });
    renderTasks();
    logAction(`Added a new task.`);
}

function addSubtask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    task.subtasks.push({ completed: false });
    renderTasks();
    logAction(`Added a subtask to task ${taskId}.`);
}

function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    task.completed = task.subtasks.every(subtask => subtask.completed);
    renderTasks();
    logAction(`Toggled completion for task ${taskId}.`);
}

function logAction(action) {
    history.push(action);
    if (history.length > 25) history.shift(); // Only keep the last 25 actions
    renderHistory();
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = tasks.map(task => `
        <div class="task">
            <span>${task.id}</span>
            <button onclick="addSubtask('${task.id}')">Add Subtask</button>
            <button onclick="toggleTaskCompletion('${task.id}')">Complete Task</button>
        </div>
    `).join('');
    updateProgress();
}

function renderHistory() {
    const historyLog = document.getElementById('historyLog');
    historyLog.innerHTML = history.map(action => `<li>${action}</li>`).join('');
}

function updateProgress() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
    document.getElementById('progress').style.width = `${progress}%`;
}

function changeColorScheme() {
    document.body.style.backgroundColor = document.getElementById('colorScheme').value;
}

function changeFontStyle() {
    document.body.style.fontFamily = document.getElementById('fontStyle').value;
}
