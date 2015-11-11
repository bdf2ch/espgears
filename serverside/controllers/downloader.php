<?php

include "../config.php";
include "../core.php";

$result = array();

if (isset($_GET["requestId"]) && isset($_GET["docType"])) {
    $requestId = $_GET["requestId"];
    $docType = $_GET["docType"];
    switch ($docType) {
        case "tu":
            download_tu($requestId);
            break;
        case "gs":
            download_gs($requestId);
            break;
        case "doud":
            download_doud($requestId);
            break;
    }
}



function download_tu ($requestId) {
    global $db_host;
    global $db_name;
    global $db_user;
    global $db_password;

    /* Подключение к БД */
    $connection = oci_connect($db_user, $db_password, $db_host, 'AL32UTF8');
    if (!$connection){
        oci_close($connection);
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        $cursor = oci_new_cursor($connection);
        if (!$statement = oci_parse($connection, "begin PKG_TITULES.P_GET_TU_DOC(:r_id, :tu); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":r_id", $requestId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":tu", $cursor, -1, OCI_B_CURSOR)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            } else {
                if (!oci_execute($cursor)) {
                    $error = oci_error();
                    $result = new DBError($error["code"], $error["message"]);
                    echo(json_encode($result));
                } else {
                    $tu = oci_fetch_assoc($cursor);
                    header('Content-Description: File Transfer');
                    header('Content-Disposition: attachment; filename="'.$tu["FILE_TITLE"].'"');
                    header('Cache-Control: max-age=0');
                    header('Pragma: public');
                    header('Content-Length: '. $tu["FILE_SIZE"]);
                    header('Content-Type: '.$tu["FILE_TYPE"]);
                    echo $tu["FILE_CONTENT"] -> load();
                }
            }
        }
    }
    oci_free_statement($statement);
    oci_free_statement($cursor);
    oci_close($connection);
};



function download_gs ($requestId) {
    global $db_host;
    global $db_name;
    global $db_user;
    global $db_password;

    /* Подключение к БД */
    $connection = oci_connect($db_user, $db_password, $db_host, 'AL32UTF8');
    if (!$connection){
        oci_close($connection);
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        $cursor = oci_new_cursor($connection);
        if (!$statement = oci_parse($connection, "begin PKG_TITULES.P_GET_GEN_SOGL_DOC(:r_id, :gs); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":r_id", $requestId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":gs", $cursor, -1, OCI_B_CURSOR)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            } else {
                if (!oci_execute($cursor)) {
                    $error = oci_error();
                    $result = new DBError($error["code"], $error["message"]);
                    echo(json_encode($result));
                } else {
                    $gs = oci_fetch_assoc($cursor);
                    header('Content-Description: File Transfer');
                    header('Content-Disposition: attachment; filename="'.$gs["FILE_TITLE"].'"');
                    header('Cache-Control: max-age=0');
                    header('Pragma: public');
                    header('Content-Length: '. $gs["FILE_SIZE"]);
                    header('Content-Type: '.$gs["FILE_TYPE"]);
                    echo $gs["FILE_CONTENT"] -> load();
                }
            }
        }
    }
    oci_free_statement($statement);
    oci_free_statement($cursor);
    oci_close($connection);
};



function download_doud ($requestId) {
    global $db_host;
    global $db_name;
    global $db_user;
    global $db_password;

    /* Подключение к БД */
    $connection = oci_connect($db_user, $db_password, $db_host, 'AL32UTF8');
    if (!$connection){
        oci_close($connection);
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        $cursor = oci_new_cursor($connection);
        if (!$statement = oci_parse($connection, "begin PKG_TITULES.P_GET_DOUD_DOC(:r_id, :doud); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":r_id", $requestId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":doud", $cursor, -1, OCI_B_CURSOR)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            } else {
                if (!oci_execute($cursor)) {
                    $error = oci_error();
                    $result = new DBError($error["code"], $error["message"]);
                    echo(json_encode($result));
                } else {
                    $doud = oci_fetch_assoc($cursor);
                    header('Content-Description: File Transfer');
                    header('Content-Disposition: attachment; filename="'.$doud["FILE_TITLE"].'"');
                    header('Cache-Control: max-age=0');
                    header('Pragma: public');
                    header('Content-Length: '. $doud["FILE_SIZE"]);
                    header('Content-Type: '.$doud["FILE_TYPE"]);
                    echo $doud["FILE_CONTENT"] -> load();
                }
            }
        }
    }
    oci_free_statement($statement);
    oci_free_statement($cursor);
    oci_close($connection);
};



?>