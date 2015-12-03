<?php

include "../config.php";
include "../core.php";

$postdata = json_decode(file_get_contents('php://input'));
$action = $postdata -> action;

switch ($action) {
    case "logIn":
        log_in($postdata);
        break;
    case "logOut":
        log_out($postdata);
        break;
    case "changePassword":
        change_password($postdata);
        break;
}




function log_in ($postdata) {
    global $db_host;
    global $db_name;
    global $db_user;
    global $db_password;
    $username = $postdata -> data -> username;
    $password = $postdata -> data -> password;
    $result = array();

    /* Подключение к БД */
    $connection = oci_connect($db_user, $db_password, $db_host, 'AL32UTF8');
    if (!$connection){
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!$statement = oci_parse($connection, "begin pkg_authorization.p_sign_in(:auth_email, :auth_password, :session_token, :session_started, :session_expires, :user_id, :user_group_id, :user_name, :user_fname, :user_surname, :user_position, :user_email, :user_phone); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":auth_email", $username, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":auth_password", $password, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":session_token", $session_token, 256, SQLT_CHR)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":session_started", $session_started, -1, OCI_B_INT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":session_expires", $session_expires, -1, OCI_B_INT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":user_id", $user_id, -1, OCI_B_INT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":user_group_id", $user_group_id, -1, OCI_B_INT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":user_name", $user_name, 1000, SQLT_CHR)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":user_fname", $user_fname, 1000, SQLT_CHR)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":user_surname", $user_surname, 1000, SQLT_CHR)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":user_position", $user_position, 1000, SQLT_CHR)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":user_email", $user_email, 1000, SQLT_CHR)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":user_phone", $user_phone, 1000, SQLT_CHR)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            } else {
                $result["TOKEN"] = $session_token;
                $result["STARTED"] = $session_started;
                $result["EXPIRES"] = $session_expires;
                $result["ID"] = $user_id;
                $result["USER_GROUP_ID"] = $user_group_id;
                $result["FNAME"] = $user_name;
                $result["SNAME"] = $user_fname;
                $result["SURNAME"] = $user_surname;
                $result["POSITION"] = $user_position;
                $result["EMAIL"] = $user_email;
                $result["PHONE"] = $user_phone;
                echo(json_encode($result));
            }

            /* Освобождение ресурсов */
            oci_free_statement($statement);
            oci_close($connection);
        }
    }
};



function log_out ($postdata) {
    global $db_host;
    global $db_name;
    global $db_user;
    global $db_password;
    $session_token = $postdata -> data -> sessionToken;
    $result = "";

    /* Подключение к БД */
    $connection = oci_connect($db_user, $db_password, $db_host, 'AL32UTF8');
    if (!$connection){
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!$statement = oci_parse($connection, "begin pkg_authorization.p_sign_out(:session_token, :answer); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":session_token", $session_token, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":answer", $result, 50, SQLT_CHR)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            } else {
                echo(json_encode($result));
            }

            /* Освобождение ресурсов */
            oci_free_statement($statement);
            oci_close($connection);
        }
    }
};




function change_password ($postdata) {
    global $db_host;
    global $db_name;
    global $db_user;
    global $db_password;
    $userId = $postdata -> data -> userId;
    $password = $postdata -> data -> password;
    $result = "";

    /* Подключение к БД */
    $connection = oci_connect($db_user, $db_password, $db_host, 'AL32UTF8');
    if (!$connection){
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!$statement = oci_parse($connection, "begin pkg_authorization.p_change_password(:user_id, :password, :answer); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":user_id", $userId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":password", $password, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":answer", $result, 50, SQLT_CHR)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            } else {
                echo(json_encode($result));
            }

            /* Освобождение ресурсов */
            oci_free_statement($statement);
            oci_close($connection);
        }
    }
};

?>