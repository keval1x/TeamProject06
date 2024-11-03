<?php
include "_session.php";
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forums</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
    <style>
        body {
            margin: 0;
        }

        .topic {
            margin-bottom: 20px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            position: relative;
        }

        .posts {
            max-width: 100%;
            word-wrap: break-word;
        }

        .posts div {
            margin-top: 10px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 100%;
            word-wrap: break-word;
        }

        h1 {
            text-align: center;
            margin-top: 80px;
        }

        .navbar-custom {
            background-color: skyblue;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
        }

        .navbar-brand {
            flex-grow: 1;
            text-align: center;
        }

        .profile-picture {
            display: none;
            position: absolute;
            top: 50px;
            right: 10px;
            background-color: #f8f9fa;
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .profile-icon:hover+.profile-picture,
        .profile-picture:hover {
            display: block;
        }

        .navbar .container-fluid {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    </style>
</head>
<?php
    is_logged_in();
?>
<body class="container mt-5">

    <nav class="navbar navbar-expand-lg navbar-custom">
        <div class="container-fluid d-flex align-items-center position-relative">
            <!-- Links for the buttons on the top left -->
            <div class="d-flex">
                <form action="forums.php" method="post">
                    <fieldset>
                        <button type="submit" class="btn btn-outline-secondary me-2" name="logout">Logout</button>
                    </fieldset>
                </form>
                <a href="knowledge.html" class="btn btn-outline-secondary me-2">Knowledge Sharing</a>
            </div>

            <!-- Company Name Text -->
            <div class="position-absolute top-50 start-50 translate-middle">
                <span class="navbar-text text-white fs-4 fw-bold">MAKE-IT-ALL</span>
            </div>

            <!-- Profile Picture Icon on the top right -->
            <div class="position-relative">
                <i class="fa-solid fa-user fa-2x profile-icon" style="cursor:pointer;"></i>
                <!-- Profile Picture -->
                <div class="profile-picture">
                    <strong>Manager Name:</strong> <br> Manager1
                </div>
            </div>
        </div>
    </nav>

    <!-- Header of the page -->
    <h1>Forums</h1>

    <!-- Form to Create  Topic -->
    <h3>Create Topic</h3>
    <form id="createTopicForm">
        <div class="form-group">
            <label for="topicName">Topic Name:</label>
            <input type="text" class="form-control" id="topicName" required>
        </div>
        <button type="submit" class="btn btn-primary mt-3">Add Topic</button>
    </form>

    <!-- Div for List of Topics -->
    <div id="topicsList" class="mt-4"></div>

    <script>
        const topics = [];

        // Hardcoded users for prototype
        const users = ["Employee 1", "Employee 2", "Manager 1"]; // Sample usernames for prototype

        // Function to add a topic
        document.getElementById('createTopicForm').addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent form submission

            const topicName = document.getElementById('topicName').value;
            const topicId = topics.length + 1;
            const topicCreator = users[topicId % users.length];

            // Create a new topic object
            const newTopic = {
                id: topicId,
                name: topicName,
                creator: topicCreator,
                posts: []
            };

            topics.push(newTopic);
            showTopics();
            this.reset(); // Clear the form
        });

        // Function to show topics
        function showTopics() {
            const topicsList = document.getElementById('topicsList');
            topicsList.innerHTML = ''; // Clear previous topics

            topics.forEach(topic => {
                const topicsDiv = document.createElement('div');
                topicsDiv.className = 'topic position-relative';

                // Show topic name with creator of the topic
                const topicHeader = document.createElement('h4');
                topicHeader.className = 'd-flex justify-content-between align-items-center';
                topicHeader.innerHTML = `
            ${topic.name} <small style="color: gray; margin-left: 10px;"> - ${topic.creator}</small>
            <button class="btn btn-danger btn-sm" style="margin-left: auto;" onclick="deleteTopic(${topic.id})">Delete Topic</button>
        `;

                topicsDiv.appendChild(topicHeader);

                const postForm = document.createElement('form');
                postForm.innerHTML = `
            <input type="text" class="form-control" placeholder="Post Content" required>
            <button type="submit" class="btn btn-secondary mt-2">Add Post</button>
        `;
                postForm.addEventListener('submit', function (event) {
                    event.preventDefault();
                    const postContent = postForm.querySelector('input').value;
                    const postCreator = users[(Math.floor(Math.random() * users.length))]; // Random creator for each post ( Just for prototype )
                    addPost(topic.id, postContent, postCreator);
                    postForm.reset();
                });

                topicsDiv.appendChild(postForm);
                const postsDiv = document.createElement('div');
                postsDiv.className = 'posts';
                postsDiv.id = `posts-${topic.id}`;
                topicsDiv.appendChild(postsDiv);

                topicsList.appendChild(topicsDiv);
                showPosts(topic.id);
            });
        }

        // Function to add a post with a creator name shown next to the post
        function addPost(topicId, content, creator) {
            const topic = topics.find(t => t.id === topicId);
            if (topic) {
                topic.posts.push({ content, creator });
                showPosts(topicId);
            }
        }

        // Function to show posts for the specific topic
        function showPosts(topicId) {
            const postsDiv = document.getElementById(`posts-${topicId}`);
            postsDiv.innerHTML = ''; // Clear previous posts

            const topic = topics.find(t => t.id === topicId); // Searching for the specific topic in the array which has same ID with topicID
            if (topic && topic.posts.length > 0) {
                topic.posts.forEach((post, index) => {
                    const postDiv = document.createElement('div');
                    postDiv.className = 'd-flex justify-content-between align-items-center';
                    postDiv.innerHTML = `
                <div>${post.content} <small style="color: gray; margin-left: 10px;"> - ${post.creator}</small></div>
                <button class="btn btn-danger btn-sm ms-1" onclick="deletePost(${topicId}, ${index})">Delete Post</button>
            `;
                    postsDiv.appendChild(postDiv);
                });
            }
        }


        // Function to delete a post
        function deletePost(topicId, postIndex) {
            const topic = topics.find(t => t.id === topicId);
            if (topic && topic.posts[postIndex]) {
                topic.posts.splice(postIndex, 1); // Remove the post from the array
                showPosts(topicId); // Refresh the displayed posts
            }
        }

        // Function to delete a topic
        function deleteTopic(topicId) {
            const topicIndex = topics.findIndex(t => t.id === topicId);
            if (topicIndex !== -1) {
                topics.splice(topicIndex, 1); // Remove the topic from the array
                showTopics(); // Refresh the displayed topics
            }
        }
    </script>
</body>
</html>
<?php
    if($_SERVER['REQUEST_METHOD'] == "POST" and isset($_POST['logout']))
    {
        session_kill();
    }