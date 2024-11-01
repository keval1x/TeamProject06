<?php
include "session.php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register Account</title>
    <link rel="stylesheet" href="css/styles.css">
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
    <form action="register.php" method="post" class="p-5 c rbb">
        <fieldset>
            <input class="lf mb-2" type="email" id="usern" name="usern" onkeydown="return event.key != 'Enter';">
            <input class="lf mb-2" type="password" id="passw" name="passw"><br>
            <input class="lf mb-2" type="text" id="foren" name="foren">
            <input class="lf mb-2" type="text" id="surnm" name="surnm"><br>
            <button class="lf" type="submit" name="register">Register</button>
            <a href="login.php">
                <button class="lf" type="button">Return</button>
            </a>
        </fieldset>
    </form>
    <script src="js/lreqs.js"></script>
</body>
</html>
<?php

const _EMAIL = '/^[a-zA-Z0-9]+@make-it-all.co.uk$/';
const _PASS = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[_!"£$%^&*])[a-zA-Z0-9_!"£$%^&*]{8,32}$/';

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "usercreds";
//consider replacing with non root user

$conn = mysqli_connect($servername, $username, $password, $dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
  }

if($_SERVER['REQUEST_METHOD'] == "POST" and isset($_POST["register"])) {

    $email = trim($_POST['usern']);
    $passw = trim($_POST["passw"]);
    $foren = trim($_POST['foren']);
    $surnm = trim($_POST["surnm"]);

    //and commence a disgusting number of catches

    if($passw == '' || $email == '' || $foren == '' || $surnm == '') 
    {
        echo '<script type="text/javascript"> alert("Please fill out all fields."); window.location="register.php"; </script>'; 
        exit;
    }
    
    if(!preg_match(_EMAIL, $email))
    {
        echo '<script type="text/javascript"> alert("Please ensure you are using a valid company email when registering."); window.location="register.php"; </script>'; 
        exit;
    }

    if(!preg_match(_PASS, $passw))
    {
        echo '<script type="text/javascript"> alert("Please ensure your password meets the following requirements:\nbetween 8 and 32 characters,\ncontains at least one lowercase character,\ncontains at least one uppercase character,\ncontains at least one number,\nand contains at least one symbol ( _!\"£$%^&* )"); window.location="register.php"; </script>'; 
        exit;
    }

    $epass = sha1($passw);

    $sql = "SELECT `email` FROM `users` WHERE `email`='$email'";
    $result = mysqli_query($conn, $sql);

    if(mysqli_num_rows($result)==1){
        echo '<script type="text/javascript"> alert("There is already an account associated with this email. Try logging in instead."); window.location="register.php"; </script>'; 
    }

    $sql = "INSERT INTO users (forename, surname, email, password, isadmin)
            VALUES ('$foren', '$surnm', '$email', '$epass', 0);";
    $result = mysqli_query($conn, $sql);

    if(!$result) {
        echo '<script type="text/javascript"> alert("Unknown error occured, please try again."); window.location="register.php"; </script>'; 
    }

    echo '<script type="text/javascript"> alert("Account created successfully."); window.location="register.php"; </script>'; 

}

//this file gives me the fucking disease, need to fix it
