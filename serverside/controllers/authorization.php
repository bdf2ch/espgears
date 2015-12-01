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
    global $db_host;
    global $db_name;
    global $db_user;
    global $db_password;
    $username = $postdata -> data -> username;
    $password = $postdata -> data -> password;
    $result = new stdClass;

    /* Подключение к БД */
    $connection = oci_connect($db_user, $db_password, $db_host, 'AL32UTF8');
    if (!$connection){
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!$statement = oci_parse($connection, "begin pkg_authorization.p_sign_in(:usr_mail, :usr_password, :token, :user); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            $token_cursor = oci_new_cursor($connection);
            $user_cursor = oci_new_cursor($connection);
            if (!oci_bind_by_name($statement, ":usr_mail", $username, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":usr_password", $password, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":token", $token_cursor, -1, OCI_B_CURSOR)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":user", $user_cursor, -1, OCI_B_CURSOR)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            } else {
                    if (!oci_execute($token_cursor)) {
                        $error = oci_error();
                        $result = new DBError($error["code"], $error["message"]);
                        echo(json_encode($result));
                    } else {
                       $result -> session = oci_fetch_array($token_cursor, OCI_ASSOC+OCI_RETURN_NULLS);
                    }

                if (!oci_execute($user_cursor)) {
                    $error = oci_error();
                    $result = new DBError($error["code"], $error["message"]);
                    echo(json_encode($result));
                } else {
                    $result -> user = oci_fetch_object($user_cursor);
                }
                echo (json_encode($result));
            }

            /* Освобождение ресурсов */
            oci_free_statement($statement);
            oci_close($connection);
        }
    }
};

?>