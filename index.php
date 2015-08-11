<?php
    include("libs/xtemplate/xtemplate.class.php");

    //setcookie("_appUser_", "dasdasdasd");

    //if (isset($_COOKIE["_appUser_"]))
        $template = new XTemplate("templates/application.html");
    //else
    //    $template = new XTemplate("templates/authorization.html");

    $template -> parse("main");
    $template -> out("main");
?>