<?php

include "../config.php";
include "../core.php";
$postdata = json_decode(file_get_contents('php://input'));
$result = array();
$requestId = $postdata -> data -> requestId;

/* Подключение к БД */
$connection = oci_connect($db_user, $db_password, $db_host, 'AL32UTF8');
if (!$connection){
    oci_close($connection);
    $error = oci_error();
    $result = new DBError($error["code"], $error["message"]);
    echo(json_encode($result));
} else {
    if (!$statement = oci_parse($connection, "SELECT * FROM tu_docs WHERE request_id = :r_id")) {
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!oci_bind_by_name($statement, ":r_id", $requestId, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_execute($statement)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            $tu = oci_fetch_assoc($statement);
            header('Cache-Control: maxage=90');
            header('Pragma: public');
            //header('Content-Description: File Transfer');
            //header('Content-length: '. $tu["FILE_SIZE"]);
            header('Content-Type: '.$tu["FILE_TYPE"]);
            header('Content-Disposition: attachment; filename="'.$tu["FILE_TITLE"].'"');

            //header('Pragma: public'); 	// required
            //header('Expires: 0');		// no cache
            //header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            //header('Last-Modified: '.gmdate ('D, d M Y H:i:s', filemtime (time())).' GMT');
            //header('Cache-Control: private',false);
            //header('Content-Type: '.$tu["FILE_TYPE"]);
            //header('Content-Disposition: attachment; filename="'.$tu["FILE_TITLE"].'"');
            //header('Content-Transfer-Encoding: binary');
            //header('Content-Length: '.$tu["FILE_SIZE"]);	// provide file size
            //header('Connection: close');

            echo $tu["FILE_CONTENT"] -> load();
        }
    }

}
oci_close($connection);

?>