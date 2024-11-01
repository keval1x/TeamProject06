<?php
include 'session.php';
?>
<!DOCTYPE html>
<html lang="en"> 
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Webportal Login</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<?php
    is_logged_in();
?>
<body><!-- <\?php echo $_SESSION['IS_ADMIN'];?> -->
    <form action="homepage.php" method="post">
        <input type="submit" name="logout" value="reset"/>
    </form>
</body>
<?php
    if($_SERVER['REQUEST_METHOD'] == "POST" and isset($_POST['logout']))
    {
        session_kill();
    }
?>
<!-- this file is temp, redirect to actual dashboard -->
