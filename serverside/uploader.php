<?php

    include("config.php");
    include("core.php");

    if (!empty($_FILES)) {
        echo(json_encode($_FILES));
    }

?>