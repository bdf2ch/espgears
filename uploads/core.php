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

        public function __construct ($path_to) {
            if (file_exists($path_to)) {
                $this -> path = $path_to;
                $this -> title = basename($path_to);
                $this -> size = filesize($path_to);
                if (is_dir($path_to)) {
                    $this -> isDirectory = true;
                    if (sizeof(scandir($path_to)) > 0)
                        $this -> isEmpty = false;
                }
            }
        }
    };

?>