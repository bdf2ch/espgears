<?php
    include("../core.php");

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
        echo(json_encode("pizda"));
    };

?>