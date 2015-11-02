<?php

include "../config.php";
include "../core.php";


if (isset($_FILES["file"]["tmp_name"])) {
    $result = stdClass;
    $result -> title = $_FILES["file"]["name"];
    $result -> type = $_FILES["upload"]["type"];
    $result -> size = $_FILES["upload"]["size"];
    $result -> test = "testfield";

    //$requestId = $_POST["requestId"];
    $requestId = $_POST["requestId"];;
    //echo($_POST["doc_type"]);

    switch ($_POST["doc_type"]) {
        case "tu":
            upload_tu();
            break;
        case "genSogl":
            upload_gen_sogl();
            break;
    }
}


function upload_tu () {
    global $db_user;
    global $db_password;
    global $db_host;
    global $requestId;
    //global $result;

    $connection = oci_connect($db_user, $db_password, $db_host, 'AL32UTF8');
    if (!$connection){
        oci_close($connection);
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!$statement = oci_parse($connection, "begin pkg_titules.p_add_tu_doc(:request_id, :blob); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            $blob = oci_new_descriptor($connection, OCI_D_LOB);
            if (!oci_bind_by_name($statement, ":request_id", $requestId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":blob", $blob, -1, OCI_B_BLOB)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            } else {
                if(!$blob -> savefile($_FILES["upload"]["tmp_name"])) {
                    oci_rollback($connection);
                } else {
                    oci_commit($connection);
                }
            }

            // Освобождение ресурсов
            oci_free_statement($statement);
            $blob -> free();
            // Возврат результата
            //echo(json_encode($result));
        }
        oci_close($connection);
    }
};

echo(json_encode($result));

?>