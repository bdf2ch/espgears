<?php

include "../config.php";
include "../core.php";


if (isset($_FILES["file"]["tmp_name"])) {
    //echo("tmpname = ".$_FILES["file"]["tmp_name"]);
    //print_r($_FILES["file"]);
    //print_r(file_get_contents($_FILES["file"]["tmp_name"]));
    $result = new stdClass;
    $result -> title = $_FILES["file"]["name"];
    $result -> type = $_FILES["file"]["type"];
    $result -> size = $_FILES["file"]["size"];
    $requestId = $_POST["requestId"];;

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
    global $result;

    $connection = oci_connect($db_user, $db_password, $db_host, 'AL32UTF8');
    if (!$connection) {
        oci_close($connection);
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {


         $lob = oci_new_descriptor($connection, OCI_D_LOB);
         $stmt = oci_parse($connection, "insert into tu_docs (id, file_title, file_size, file_type, file_content, request_id) values (seq_tu_docs.NEXTVAL, :file_title, :file_size, :file_type, EMPTY_BLOB(), :request_id) returning file_content into :the_blob");
         oci_bind_by_name($stmt, ':file_title', $result -> title, -1, OCI_DEFAULT);
         oci_bind_by_name($stmt, ':file_size', $result -> size, -1, OCI_DEFAULT);
         oci_bind_by_name($stmt, ':file_type', $result -> type, -1, OCI_DEFAULT);
         oci_bind_by_name($stmt, ':the_blob', $lob, -1, OCI_B_BLOB);
         oci_bind_by_name($stmt, ':request_id', $requestId, -1, OCI_DEFAULT);
         oci_execute($stmt, OCI_DEFAULT);
         //$content = file_get_contents($_FILES["file"]["tmp_name"]);
         if ($lob->savefile($_FILES["file"]["tmp_name"])){
            oci_commit($connection);
            echo "Blob successfully uploaded\n";
         } else {
            echo "Couldn't upload Blob\n";
         }
         $lob->free();
         oci_free_statement($stmt);
         oci_close($connection);



        /**
        if (!$statement = oci_parse($connection, "begin pkg_titules.p_add_tu_doc(:r_id, :r_file_title, :r_file_size, :r_file_type, :r_file_content); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            $blob = oci_new_descriptor($connection, OCI_D_LOB);
            if (!oci_bind_by_name($statement, ":r_id", $requestId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":r_file_title", $result -> title, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":r_file_size", $result -> size, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":r_file_type", $result -> type, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":r_file_content", $blob, -1, OCI_B_BLOB)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            } else {
                $content = file_get_contents($_FILES["file"]["tmp_name"]);
                if (!$blob -> save($content)) {
                    oci_rollback($connection);
                    echo("file upload error");
                    print_r(oci_error());
                } else {
                    oci_commit($connection);
                }
            }

            // Освобождение ресурсов
            oci_free_statement($statement);
            $blob -> free();
        }
        oci_close($connection);
        **/
    }
};

echo(json_encode($result));

?>