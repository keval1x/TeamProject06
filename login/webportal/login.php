<?php
include "session.php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Webportal Login</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">  
    <link rel="stylesheet" href="https://getbootstrap.com/docs/5.3/assets/css/docs.css">
    <link rel="stylesheet" href="css/styles.css">
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</head>
<?php
    if(logged_in())
    {
        echo '<script type="text/javascript"> window.location="homepage.php"; </script>'; 
    }
?>
        
<body class="p-5 mx-6 border-0 bd-example m-0 border-0 my-5 c">

    <div class="container-fluid p-5 bg-primary text-white text-center min-width rbh">
        <h1>Make It All Webportal</h1>
    </div>

    <form action="login.php" method="post" class="p-5 c rbb">
        <fieldset>
            <input class="lf mb-2" type="email" id="usern" name="usern" onkeydown="return event.key != 'Enter';">
            <input class="lf mb-2" type="password" id="passw" name="passw"><br>
            <button class="lf" type="submit" name="login">Login</button>
            <button class="lf" type="button" onclick="lreq(false)">Register</button>
        </fieldset>
    </form>
    <script src="js/lreqs.js"></script>
</body>
</html>
<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "usercreds";
//consider replacing with non root user

$conn = mysqli_connect($servername, $username, $password, $dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
  }

if($_SERVER['REQUEST_METHOD'] == "POST" and isset($_POST["login"])) {

    $email = trim($_POST['usern']);
    $passw = sha1(trim($_POST["passw"]));

    if($passw == '' || $email == '') 
    {
        echo '<script type="text/javascript"> alert("Username or password missing."); window.location="login.php"; </script>'; // hate these sm
        exit;
    }
    
    $sql = "SELECT * FROM `users` WHERE `email` = '$email' AND `password` = '$passw'";
    $result = mysqli_query($conn, $sql);

    if(mysqli_num_rows($result)==1){

        $details = mysqli_fetch_array($result);

        $_SESSION['ID'] = $details['id'];
        $_SESSION['FORENAME'] = $details['forename'];
        $_SESSION['IS_ADMIN'] = $details['isadmin'];

        echo '<script type="text/javascript"> window.location="homepage.php"; </script>';
        exit;

    } 

    echo '<script type="text/javascript"> alert("Username or password incorrect."); window.location="login.php"; </script>';
    exit;

}
