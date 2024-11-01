<?php
    session_start();

    function logged_in() {
        return isset($_SESSION['ID']);
    }

    function is_logged_in(){
        if(!logged_in()) echo '<script type="text/javascript"> window.location="login.php"; </script>';
    }

    function session_kill() {
        session_unset();
        echo '<script type="text/javascript"> window.location="login.php"; </script>';
    }

//only good bit of the login system, the rest is aids
