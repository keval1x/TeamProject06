<?php
    session_start();

    function logged_in() {
        return isset($_SESSION['ID']);
    }

    function is_logged_in(){
        if(!logged_in()) echo '<script type="text/javascript"> window.location="_login.php"; </script>';
    }

    function session_kill() {
        session_unset();
        echo '<script type="text/javascript"> window.location="_login.php"; </script>';
    }