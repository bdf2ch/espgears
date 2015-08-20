<?php
    include("../core.php");

    $postdata = json_decode(file_get_contents('php://input'));
    $root_dir = $_SERVER['DOCUMENT_ROOT'].DIRECTORY_SEPARATOR."espgears".DIRECTORY_SEPARATOR."uploads";

    switch ($postdata -> action) {
        case "scan":
            if ($postdata -> data !== null)
                scan_folder($postdata -> data -> path);
            else
                scan_folder($root_dir);
            break;
    }


    function scan_folder ($folder_path) {
        $result = array();
        if ($folder_path !== null) {
            if (file_exists($folder_path)) {
                if (is_dir($folder_path)) {
                    if ($handler = opendir($folder_path)) {
                        while (false !== ($file = readdir($handler))) {
                            if ($file !== "." && $file !== "..") {
                                $temp_file = new FileItem($folder_path.DIRECTORY_SEPARATOR.$file);
                                array_push($result, $temp_file);
                            }
                        }
                        closedir($handler);
                    }
                } else {
                    $error = new FSError("Заданная корневая папка '".$folder_path."' не является директорией");
                    $result = $error;
                }
            } else {
                $error = new FSError("Директория '".$folder_path."' не существует");
                $result = $error;
            }
        }
        echo(json_encode($result));
    };

?>