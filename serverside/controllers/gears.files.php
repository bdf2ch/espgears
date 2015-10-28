<?php
    include("../core.php");
    include("../config.php");

    $postdata = json_decode(file_get_contents('php://input'));
    $root_dir = $_SERVER["DOCUMENT_ROOT"].DIRECTORY_SEPARATOR."uploads";

    switch ($postdata -> action) {
        case "scan":
            if ($postdata -> data -> path !== null)
                scan_folder($postdata -> data -> path);
            else
                scan_folder();
            break;
        case "upload":
            upload_file($postdata);
            break;
    }


    function scan_folder ($path) {
        $result = array();
        $target = "";
        if (!is_null($path))
            $target = $_SERVER["DOCUMENT_ROOT"].DIRECTORY_SEPARATOR."uploads".DIRECTORY_SEPARATOR.iconv("UTF-8", "windows-1251", $path);
        else
            $target = $_SERVER["DOCUMENT_ROOT"].DIRECTORY_SEPARATOR."uploads";
        if (file_exists($target)) {
            if (is_dir($target)) {
                if ($handler = opendir($target)) {
                    while (false !== ($file = readdir($handler))) {
                        if ($file !== "." && $file !== "..") {
                            $full_path = iconv("UTF-8", "windows-1251", $path).DIRECTORY_SEPARATOR.$file;
                            $temp_file = new FileItem($full_path);
                            array_push($result, $temp_file);
                        }
                    }
                    closedir($handler);
                }
            } else {
                $error = new FSError("Заданная корневая папка '".$full_path."' не является директорией");
                $result = $error;
            }
        } else {
                $error = new FSError("Директория '".$full_path."' не существует");
                $result = $error;
        }

        echo(json_encode($result));

        //global $root_dir;
        //echo(json_encode($root_dir));
    };



    function upload_file ($postdata) {
        if (!isset($lob_upload) || $lob_upload == 'none') {

        } else {
            /* Подключение к БД */
            $connection = oci_connect($db_user, $db_password, $db_host, 'AL32UTF8');
            if (!$connection){
                oci_close($connection);
                print_r(oci_error());
                die('Не удалось подключиться к БД');
            } else {
                $lob = oci_new_descriptor($connection, OCI_D_LOB);
                $statement = oci_parse($connection, "begin PKG_FILES.P_INSERT_REQUEST_INPUT_FILE(:blob, :title, :filesize, :mime_type); end;";
                if (!oci_bind_by_name($statement, ":blob", $lob, -1, OCI_B_BLOB)) {
                    $error = oci_error();
                    echo $error["message"];
                }
                if (!oci_execute($statement, OCI_DEFAULT)) {
                    $error = oci_error();
                    echo $error["message"];
                } else {
                    if ($lob -> savefile($lob_upload)){
                        oci_commit($connection);
                        echo "Blob successfully uploaded\n";
                    } else {
                        echo "Couldn't upload Blob\n";
                    }
                }

                 oci_free_descriptor($lob);
                 oci_free_statement($statement);
                 oci_close($connection);
            }
        }

    };

?>