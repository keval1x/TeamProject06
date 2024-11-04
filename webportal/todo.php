<?php
include "_session.php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>To Do List</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">  
    <link rel="stylesheet" href="https://getbootstrap.com/docs/5.3/assets/css/docs.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="css/styles.css">

    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</head>
<?php
    is_logged_in();
?>
<body class="bdy">
    <nav class="navbar navbar-expand-lg navbar-custom py-5">
        <div class="container-fluid d-flex align-items-center position-relative">
            <!-- Links for the buttons on the top left -->
            <div class="d-flex">
                <form action="todo.php" method="post">
                    <fieldset>
                        <button type="submit" class="btn btn-outline-secondary me-2 text-white mx-5" name="logout">Logout</button>
                    </fieldset>
                </form>
                <a href="dashboard.php" class="btn btn-outline-secondary me-2 text-white mx-3">Dashboard</a>
                <a href="forum.php" class="btn btn-outline-secondary me-2 text-white mx-3">Forums</a>
            </div>
    
            <!-- Company Name Text -->
            <div class="position-absolute top-50 start-50 translate-middle">
                <span class="navbar-text text-white fs-1 fw-bold">MAKE-IT-ALL</span>
            </div>
    
            <!-- Profile Picture Icon on the top right -->
            <div class="position-relative ms-auto mx-5">
                <i class="fa-solid fa-user fa-2x profile-icon" style="cursor:pointer;"></i>
                <!-- Profile Picture -->
                <div class="profile-picture">
                    <strong>Manager Name:</strong> <br> <?php echo $_SESSION['FORENAME']; ?>
                </div>
            </div>
        </div>
    </nav>
  <div class="tdcontainer-fluid h1p">
    <!-- Progress Bar
    <div id="progressContainer" class="row">
      <div class="col">
        <div class="progress">
          <div
            id="progressBar"
            class="progress-bar"
            role="progressbar"
            style="width: 0%"
          ></div>
        </div>
      </div>
    </div> -->
    <!-- Sidebar -->
    <div class="row">
      <div class="col-md-2">
        <ul class="list-group">
          <li
            class="list-group-item active"
            data-section="todoContent"
            id="todoButton"
          >
            To Do List
          </li>
          <li
            class="list-group-item"
            data-section="historyContent"
            id="historyButton"
          >
            History
          </li>
          <li
            class="list-group-item"
            data-section="designContent"
            id="designButton"
          >
            Design
          </li>
        </ul>
      </div>
      <div class="col-md-10">
        <!-- Formatting -->
        <div class="design-bar mb-2">
          <button id="boldBtn" onmousedown="event.preventDefault()">Bold</button>
          <button id="italicBtn" onmousedown="event.preventDefault()">Italic</button>
          <button id="indentBtn" onmousedown="event.preventDefault()">Indent</button>
          <button id="outdentBtn" onmousedown="event.preventDefault()">Outdent</button>
          <select id="fontPicker" class="form-control" style="display:inline-block; width:auto;">
            <option value="">Select Font</option>
            <option value="Arial">Arial</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
          </select>
          <input
            type="color"
            id="color-picker"
            title="Choose Color"
          />
        </div>
        <!-- Add Task-->
        <button id="add-task-btn" class="btn btn-primary mb-2">Add Task</button>
        <div id="contentArea">
          <!-- To Do Content -->
          <div id="todoContent" class="section active">
            <div id="todo-list"></div>
          </div>
          <!-- History-->
          <div id="historyContent" class="section text-white" style="text-align: left;">
            <h3>History</h3>
            <div id="historyList"></div>
          </div>
          <!-- Design -->
          <div id="designContent" class="section text-white" style="color: #fff;  text-align: left;">
            <h3>Design Settings</h3>
            <div class="form-group">
              <label for="colorScheme">Color Scheme:</label>
              <select id="colorScheme" class="form-control">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div class="form-group">
              <label for="globalFontSelect">Font:</label>
              <select id="globalFontSelect" class="form-control">
                <option value="sans-serif">Sans-serif</option>
                <option value="serif">Serif</option>
                <option value="monospace">Monospace</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- JavaScript Code -->
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      let taskCounter = 0;
      let tasks = [];
      let history = [];
      let selectedColor = "#000000";
      let currentContentEditableElement = null;

      // Elements
      const boldBtn = document.getElementById("boldBtn");
      const italicBtn = document.getElementById("italicBtn");
      const indentBtn = document.getElementById("indentBtn");
      const outdentBtn = document.getElementById("outdentBtn");
      const colorPicker = document.getElementById("color-picker");
      const fontPicker = document.getElementById("fontPicker");
      const addTaskBtn = document.getElementById("add-task-btn");
      const todoList = document.getElementById("todo-list");
      //const progressBar = document.getElementById("progressBar");
      const navLinks = document.querySelectorAll(".list-group-item");
      const sections = document.querySelectorAll(".section");
      const colorSchemeSelect = document.getElementById("colorScheme");
      const globalFontSelect = document.getElementById("globalFontSelect");
      const historyList = document.getElementById("historyList");

      // Event Listeners
      boldBtn.addEventListener("click", () => formatText("bold"));
      italicBtn.addEventListener("click", () => formatText("italic"));
      indentBtn.addEventListener("click", () => formatText("indent"));
      outdentBtn.addEventListener("click", () => formatText("outdent"));
      colorPicker.addEventListener("input", (event) =>
        changeTextColor(event.target.value)
      );
      fontPicker.addEventListener("change", () => {
        const fontName = fontPicker.value;
        if (fontName) {
          formatText("fontName", fontName);
        }
      });
      addTaskBtn.addEventListener("click", addTask);

      // Navigation Event Listeners
      navLinks.forEach((link) => {
        link.addEventListener("click", function () {
          navLinks.forEach((item) => item.classList.remove("active"));
          this.classList.add("active");

          const target = this.getAttribute("data-section");
          sections.forEach((section) => {
            section.classList.remove("active");
            if (section.id === target) {
              section.classList.add("active");
            }
          });
        });
      });

      // Design Settings Event Listeners
      colorSchemeSelect.addEventListener("change", () => {
        changeColorScheme(colorSchemeSelect.value);
      });

      globalFontSelect.addEventListener("change", () => {
        document.body.style.fontFamily = globalFontSelect.value;
        logHistory(
          `Changed font to ${globalFontSelect.options[globalFontSelect.selectedIndex].text}`
        );
      });

      function autoResizeDiv(div) {
        div.style.height = "auto";
        div.style.height = div.scrollHeight + "px";
      }

      function addTask() {
        let taskId = "task" + taskCounter++;
        const creationDate = new Date().toLocaleDateString();

        const taskObj = {
          id: taskId,
          title: '',
          creationDate: creationDate,
          dueDate: null,
          priority: 'Medium', // Default priority
          completed: false,
          subtasks: []
        };

        tasks.push(taskObj);

        renderTasks();

        // Log creation with the creation date
        logHistory("Created task", `New Task (created on ${creationDate})`);
      }

      function renderTasks() {
        // Clear the todoList
        todoList.innerHTML = '';

        // Sort tasks by priority
        tasks.sort((a, b) => {
          const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

        // Render each task
        tasks.forEach((task) => {
          const taskDiv = createTaskElement(task);
          todoList.appendChild(taskDiv);
        });

        //updateProgress();
      }

      function createTaskElement(task) {
        let taskDiv = document.createElement("div");
        taskDiv.className = "task-bar";
        taskDiv.id = task.id;
        taskDiv.dataset.completed = task.completed;

        taskDiv.innerHTML = `
          <div contenteditable="true" class="task-content text-white">${task.title}</div>
          <div>
            <label>Creation Date: </label><span>${task.creationDate}</span>
          </div>
          <div>
            <label>Due Date:</label>
            <input type="date" class="due-date" value="${task.dueDate || ''}">
          </div>
          <div>
            <label>Priority:</label>
            <select class="priority-select">
              <option value="High" ${task.priority === 'High' ? 'selected' : ''}>High</option>
              <option value="Medium" ${task.priority === 'Medium' ? 'selected' : ''}>Medium</option>
              <option value="Low" ${task.priority === 'Low' ? 'selected' : ''}>Low</option>
            </select>
          </div>
          <div class="text-right mt-2">
            <button class="btn btn-secondary edit-task-btn">Save</button>
            <button class="btn btn-secondary add-subtask-btn">Add Subtask</button>
            <button class="btn btn-success complete-task-btn">${task.completed ? 'Uncomplete' : 'Complete'}</button>
            <button class="btn btn-danger delete-task-btn">Delete</button>
          </div>
          <div class="subtask-list"></div>
        `;

        // Event Listeners for Task Buttons
        const editBtn = taskDiv.querySelector(".edit-task-btn");
        const addSubtaskBtn = taskDiv.querySelector(".add-subtask-btn");
        const completeBtn = taskDiv.querySelector(".complete-task-btn");
        const deleteBtn = taskDiv.querySelector(".delete-task-btn");
        const dueDateInput = taskDiv.querySelector(".due-date");
        const prioritySelect = taskDiv.querySelector(".priority-select");
        const contentDiv = taskDiv.querySelector(".task-content");
        const subtaskList = taskDiv.querySelector(".subtask-list");

        editBtn.addEventListener("click", () => editTask(task, contentDiv, editBtn));
        addSubtaskBtn.addEventListener("click", () => addSubtask(task, subtaskList));
        completeBtn.addEventListener("click", () => completeTask(task, completeBtn));
        deleteBtn.addEventListener("click", () => deleteTask(task));
        dueDateInput.addEventListener("change", () => updateDueDate(task, dueDateInput.value));
        prioritySelect.addEventListener("change", () => updatePriority(task, prioritySelect.value));

        contentDiv.addEventListener("input", function () {
          autoResizeDiv(contentDiv);
        });

        contentDiv.addEventListener('focus', function() {
          currentContentEditableElement = this;
        });

        contentDiv.addEventListener('blur', function() {
          currentContentEditableElement = null;
        });

        if (task.completed) {
          contentDiv.style.textDecoration = "line-through";
        }

        contentDiv.style.color = selectedColor;

        // Render Subtasks
        task.subtasks.forEach((subtask) => {
          const subtaskDiv = createSubtaskElement(task, subtask);
          subtaskList.appendChild(subtaskDiv);
        });

        return taskDiv;
      }

      function editTask(task, contentDiv, button) {
        if (contentDiv.isContentEditable) {
          contentDiv.contentEditable = "false";
          button.textContent = "Edit";
          task.title = contentDiv.textContent || "Unnamed Task";
          logHistory("Saved task", task.title);
        } else {
          contentDiv.contentEditable = "true";
          contentDiv.focus();
          button.textContent = "Save";
        }
      }

      function addSubtask(task, subtaskList) {
        const subtaskObj = {
          id: "subtask" + Date.now(),
          title: '',
          completed: false
        };

        task.subtasks.push(subtaskObj);
        const subtaskDiv = createSubtaskElement(task, subtaskObj);
        subtaskList.appendChild(subtaskDiv);

        logHistory("Added subtask", "New Subtask");
      }

      function createSubtaskElement(task, subtask) {
        let subtaskDiv = document.createElement("div");
        subtaskDiv.className = "subtask-bar";
        subtaskDiv.dataset.completed = subtask.completed;

        subtaskDiv.innerHTML = `
          <div contenteditable="true" class="subtask-content">${subtask.title}</div>
          <div class="text-right mt-2">
            <button class="btn btn-secondary edit-subtask-btn">Save</button>
            <button class="btn btn-success complete-subtask-btn">${subtask.completed ? 'Uncomplete' : 'Complete'}</button>
            <button class="btn btn-danger delete-subtask-btn">Delete</button>
          </div>
        `;

        const editBtn = subtaskDiv.querySelector(".edit-subtask-btn");
        const completeBtn = subtaskDiv.querySelector(".complete-subtask-btn");
        const deleteBtn = subtaskDiv.querySelector(".delete-subtask-btn");
        const contentDiv = subtaskDiv.querySelector(".subtask-content");

        editBtn.addEventListener("click", () => editSubtask(task, subtask, contentDiv, editBtn));
        completeBtn.addEventListener("click", () => completeSubtask(task, subtask, completeBtn));
        deleteBtn.addEventListener("click", () => deleteSubtask(task, subtask, subtaskDiv));

        contentDiv.addEventListener("input", function () {
          autoResizeDiv(contentDiv);
        });

        contentDiv.addEventListener('focus', function() {
          currentContentEditableElement = this;
        });

        contentDiv.addEventListener('blur', function() {
          currentContentEditableElement = null;
        });

        if (subtask.completed) {
          contentDiv.style.textDecoration = "line-through";
        }

        contentDiv.style.color = selectedColor;

        return subtaskDiv;
      }

      function editSubtask(task, subtask, contentDiv, button) {
        if (contentDiv.isContentEditable) {
          contentDiv.contentEditable = "false";
          button.textContent = "Edit";
          subtask.title = contentDiv.textContent || "Unnamed Subtask";
          logHistory("Saved subtask", subtask.title);
        } else {
          contentDiv.contentEditable = "true";
          contentDiv.focus();
          button.textContent = "Save";
        }
      }

      function completeSubtask(task, subtask, button) {
        subtask.completed = !subtask.completed;
        if (subtask.completed) {
          button.textContent = "Uncomplete";
          button.classList.remove("btn-success");
          button.classList.add("btn-danger");
          logHistory("Completed subtask", subtask.title);
        } else {
          button.textContent = "Complete";
          button.classList.remove("btn-danger");
          button.classList.add("btn-success");
          logHistory("Uncompleted subtask", subtask.title);
        }

        // Check if all subtasks are completed
        checkTaskCompletion(task);

        renderTasks();
      }

      function deleteSubtask(task, subtask, subtaskDiv) {
        task.subtasks = task.subtasks.filter(s => s.id !== subtask.id);
        logHistory("Deleted subtask", subtask.title);
        subtaskDiv.remove();

        // Check if all subtasks are completed
        checkTaskCompletion(task);

        updateProgress();
      }

      function completeTask(task, button) {
        task.completed = !task.completed;
        if (task.completed) {
          button.textContent = "Uncomplete";
          button.classList.remove("btn-success");
          button.classList.add("btn-danger");
          logHistory("Completed task", task.title);

          // Complete all subtasks
          task.subtasks.forEach(subtask => subtask.completed = true);
        } else {
          button.textContent = "Complete";
          button.classList.remove("btn-danger");
          button.classList.add("btn-success");
          logHistory("Uncompleted task", task.title);

          // Uncomplete all subtasks
          task.subtasks.forEach(subtask => subtask.completed = false);
        }
        renderTasks();
      }

      function deleteTask(task) {
        tasks = tasks.filter(t => t.id !== task.id);
        logHistory("Deleted task", task.title);
        renderTasks();
      }

      function updateDueDate(task, dueDate) {
        task.dueDate = dueDate;
        logHistory("Updated due date", `Task: ${task.title}, Due: ${dueDate}`);
      }

      function updatePriority(task, priority) {
        task.priority = priority;
        logHistory("Updated priority", `Task: ${task.title}, Priority: ${priority}`);
        renderTasks();
      }

      function checkTaskCompletion(task) {
        if (task.subtasks.length > 0) {
          task.completed = task.subtasks.every(subtask => subtask.completed);
          logHistory(
            task.completed
              ? `Task "${task.title}" automatically completed as all subtasks are done.`
              : `Task "${task.title}" marked as incomplete as some subtasks are pending.`
          );
        }
      }

      /*function updateProgress() {
        const totalTasks = tasks.length + tasks.reduce((acc, task) => acc + task.subtasks.length, 0);
        const completedTasks = tasks.filter(task => task.completed).length + tasks.reduce((acc, task) => acc + task.subtasks.filter(subtask => subtask.completed).length, 0);

        let progress =
          totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
        progressBar.style.width = progress + "%";
        progressBar.setAttribute("aria-valuenow", progress);
        progressBar.textContent = `${Math.round(progress)}%`;
      }*/

      function formatText(command, value = null) {
        document.execCommand(command, false, value);
      }

      function changeTextColor(color) {
        selectedColor = color;
        document.execCommand('styleWithCSS', false, true);
        document.execCommand('foreColor', false, color);
      }

      function changeColorScheme(scheme) {
        if (scheme === "dark") {
          document.body.classList.add("dark-mode");
        } else {
          document.body.classList.remove("dark-mode");
        }
        logHistory(`Changed color scheme to ${scheme}`);
      }

      function logHistory(action, name) {
        const timestamp = new Date().toLocaleString();
        history.unshift(`${timestamp} - ${action}: ${name}`);
        renderHistory();
      }

      function renderHistory() {
        historyList.innerHTML = "";
        history.forEach((entry) => {
          let p = document.createElement("p");
          p.textContent = entry;
          historyList.appendChild(p);
        });
      }

      // Update Due Date (for global scope access)
      window.updateDueDate = updateDueDate;
    });
  </script>
</body>
</html>
<?php
    if($_SERVER['REQUEST_METHOD'] == "POST" and isset($_POST['logout']))
    {
        session_kill();
    }