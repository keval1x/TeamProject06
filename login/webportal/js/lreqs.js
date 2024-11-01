/*const strEmail = /^[a-zA-Z0-9]+@make-it-all.co.uk$/
const strPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[_!"£$%^&*])[a-zA-Z0-9_!"£$%^&*]{8,32}$/ /*regex, pass must contain:
                                                                                    a-z, A-Z, 1-9, special char, and be 8-32 chars*/

var usern = document.getElementById("usern");
var passw = document.getElementById("passw");  // could js do this in the php file tbf

usern.addEventListener("keypress", function (e) {
    if (e.code === "Enter") {
        passw.focus();
    }
})
/*
passw.addEventListener("keypress", function (e) {
    if (e.code === "Enter") {
        lReq(true);
    }
})*/

function lreq(_hasAcc) {
    if(_hasAcc) {
        window.location="login.php";
    } else {
        window.location="register.php";
    }
}

//this file is fucking irrelevant, need to get rid of it
