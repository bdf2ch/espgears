<?php

    /**
    * DBError
    * Класс ошибки БД
    **/
    class DBError {
        public $error_code = 0;
        public $error_message = "";

        public function __construct ($code, $message) {
            $this -> error_code = $code;
            $this -> error_message = $message;
        }
    };


    class FileItem {
        public $isDirectory = false;
        public $isEmpty = true;
        public $title = "";
        public $size = 0;
        public $path = "";
        public $url = "";

        public function __construct ($path) {
            if (!is_null($path)) {
                $full_path = $_SERVER["DOCUMENT_ROOT"].DIRECTORY_SEPARATOR."uploads".DIRECTORY_SEPARATOR.$path;
                if (file_exists($full_path)) {
                    if (is_dir($full_path)) {
                        $this -> isDirectory = true;
                        if (sizeof(scandir($full_path)) - 2 > 0)
                            $this -> isEmpty = false;
                    }
                    $this -> path = iconv("windows-1251", "UTF-8", $path);
                    $this -> url = "uploads".iconv("windows-1251", "UTF-8", $path);
                    $this -> title = iconv("windows-1251", "UTF-8", basename($path));
                    $this -> size = filesize($full_path);

                }
            }
        }
    };

?>