<?php
include "_session.php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manager Dashboard</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">  
    <link rel="stylesheet" href="https://getbootstrap.com/docs/5.3/assets/css/docs.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="css/styles.css">

    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</head>
<?php
    is_logged_in();
    if($_SESSION['IS_ADMIN']==0) {
        echo '<script type="text/javascript"> window.location="todo.php"; </script>';
    }
?>
<body class="bdy">

    <nav class="navbar navbar-expand-lg navbar-custom py-5">
        <div class="container-fluid d-flex align-items-center position-relative">
            <!-- Links for the buttons on the top left -->
            <div class="d-flex">
                <form action="dashboard.php" method="post">
                    <fieldset>
                        <button type="submit" class="btn btn-outline-secondary me-2 text-white mx-5" name="logout">Logout</button>
                    </fieldset>
                </form>
                <a href="knowledgemgmt.php" class="btn btn-outline-secondary me-2 text-white mx-3">Knowledge Sharing</a>
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

    <div class="container mt-4">

        <!-- Header of the page -->
        <h1 class="text-white h1p" style="text-align: left;">Welcome, <?php echo $_SESSION['FORENAME']; ?><br><br>Manager Dashboard</h1>
        
        <!-- Left part of the body ( Team Task Overview ) -->
        <div class="row mt-5">
            <div class="col-md-6">
                <h3 class="text-white">Team Task Overview</h3>
                <ul class="list-group">
                    <!-- Team Members and Their Tasks ( Example ) -->
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Employee 1
                        <span class="badge bg-primary rounded-pill" style="cursor:pointer;" onclick="showTasks('Employee 1', 5)">5 Tasks</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Employee 2
                        <span class="badge bg-success rounded-pill" style="cursor:pointer;" onclick="showTasks('Employee 2', 3)">3 Tasks</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Employee 3
                        <span class="badge bg-danger rounded-pill" style="cursor:pointer;" onclick="showTasks('Employee 3', 8)">8 Tasks</span>
                    </li>
                </ul>
            </div>

            <!-- Left part of the body ( Project Progress ) -->
            <div class="col-md-6">
                <h3 class="text-white">Project Progress</h3>
                <!-- Example of a project progress bar -->
                <div class="progress mb-3">
                    <div class="progress-bar progress-bar-striped" role="progressbar" style="width: 80%;" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100">80% Complete</div>
                </div>
                <div class="progress mb-3">
                    <div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: 66%;" aria-valuenow="66" aria-valuemin="0" aria-valuemax="100">66% Complete</div>
                </div>
                <div class="progress">
                    <div class="progress-bar progress-bar-striped bg-danger" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25% Complete</div>
                </div>
            </div>
        </div>

        <!-- Task List Header -->
        <div class="modal fade" id="taskModal" tabindex="-1" aria-labelledby="taskHeader" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="taskHeader">Tasks for </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="taskContent">
                        <!-- Task list will be inserted here -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap - JS Dependencies -->
    <script>
        // Object to keep track of checkbox marks
        const checkboxMarks = {};
    
        function showTasks(employeeName, taskCount) {
            const taskHeader = document.getElementById('taskHeader');
            const taskContent = document.getElementById('taskContent');
            
            // Set modal header title
            taskHeader.innerText = `Tasks for ${employeeName}`;
            
            // Generate tasks dynamically based on taskCount
            const tasks = [];
            for (let i = 1; i <= taskCount; i++) {
                tasks.push({
                    title: `Task ${i} for ${employeeName}`,
                    subtasks: i % 2 === 0 ? [`Subtask ${i}.1`, `Subtask ${i}.2`] : [] // Add subtasks for even-numbered tasks
                });
            }
        
            // Generate HTML for tasks and subtasks with checkboxes
            const taskText = tasks.map((task, taskIndex) => {
                const taskCheckboxId = `${employeeName}-task-${taskIndex}`;
                const subtaskText = task.subtasks.map((subtask, subtaskIndex) => {
                    const subtaskCheckboxId = `${employeeName}-task-${taskIndex}-subtask-${subtaskIndex}`;
                    const subtaskChecked = checkboxMarks[subtaskCheckboxId] || false;
                    return `
                        <li class="list-group-item ms-3 d-flex justify-content-between align-items-center">
                            ${subtask}
                            <input type="checkbox" ${subtaskChecked ? 'checked' : ''} 
                                   onchange="toggleCheckboxMarks('${subtaskCheckboxId}', this.checked)">
                        </li>
                    `;
                }).join('');
    
                const taskChecked = checkboxMarks[taskCheckboxId] || false;
                return `
                    <li class="list-group-item">
                        <div class="d-flex justify-content-between align-items-center">
                            <span>${task.title}</span>
                            <input type="checkbox" ${taskChecked ? 'checked' : ''} 
                                   onchange="toggleCheckboxMarks('${taskCheckboxId}', this.checked)">
                        </div>
                        <ul>${subtaskText}</ul> <!-- Subtasks are now under the main task -->
                    </li>
                `;
            }).join('');
        
            // Set modal body content
            taskContent.innerHTML = `<ul class="list-group">${taskText}</ul>`;
        
            // Show modal
            const taskModal = new bootstrap.Modal(document.getElementById('taskModal'));
            taskModal.show();
        }
    
        // Function to track the state of each checkbox
        function toggleCheckboxMarks(id, isChecked) {
            checkboxMarks[id] = isChecked;
        }
    </script>
</body>
</html>
<?php
    if($_SERVER['REQUEST_METHOD'] == "POST" and isset($_POST['logout']))
    {
        session_kill();
    }