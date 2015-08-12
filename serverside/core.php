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

?>