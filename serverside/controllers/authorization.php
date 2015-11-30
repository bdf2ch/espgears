<?php

include "../config.php";
include "../core.php";

$postdata = json_decode(file_get_contents('php://input'));
$action = $postdata -> action;

switch ($action) {
    case "logIn":
        log_in($postdata);
        break;
}




function log_in ($postdata) {
    /* Подключение к БД */
    $connection = oci_connect($db_user, $db_password, $db_host, 'AL32UTF8');
    if (!$connection){
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {

    }
    oci_close($connection);
};

?>