<?php
    //if (!$_COOKIE["user"])
    //    die("Неавторизованный доступ!");
    //else {
        include "../config.php";
        include "../core.php";
        $postdata = json_decode(file_get_contents('php://input'));

        $action = $postdata -> action;
        $result = array();

        /* Подключение к БД */
        $connection = oci_connect($db_user, $db_password, $db_host, 'AL32UTF8');
        if (!$connection){
            oci_close($connection);
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            switch ($action) {
                /* Получение всех типов контрагентов */
                case "getContractorTypes":
                    get_contractor_types();
                    break;
                /* Добавление типа контрагента */
                case "addContractorType":
                    add_contractor_type($postdata);
                    break;
                /* Редактирование типа контрагента */
                case "editContractorType":
                    edit_contractor_type($postdata);
                    break;
                /* Удаление типа контрагента */
                case "deleteContractorType":
                    delete_contractor_type($postdata);
                    break;
                /* Получение всех контрагентов */
                case "getContractors":
                    get_contractors();
                    break;
                /* Добавление контрагента */
                case "addContractor":
                    add_contractor($postdata);
                    break;
                /* Редактирование контрагента */
                case "editContractor":
                    edit_contractor($postdata);
                    break;
            }
        }
        oci_close($connection);
    //}





    /* Функция получения всех титулов */
    function get_contractor_types () {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_contractor_types.p_get_contractor_types(:contractor_types); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":contractor_types", $cursor, -1, OCI_B_CURSOR)) {
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
                    while ($contractor_type = oci_fetch_assoc($cursor))
                        array_push($result, $contractor_type);
                }
            }
        }

        /* Освобождение ресурсов */
        oci_free_statement($statement);
        oci_free_statement($cursor);

        /* Возврат результата */
        echo json_encode($result);
    };





    /* Функция добавления типа контрагента */
    function add_contractor_type ($postdata) {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $title = $postdata -> data -> title;
        $result = array();

        if (!$statement = oci_parse($connection, "begin PKG_CONTRACTORS.P_ADD_CONTRACTOR_TYPE(:title, :new_type); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":title", $title, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":new_type", $cursor, -1, OCI_B_CURSOR)) {
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
                } else
                    $result = oci_fetch_assoc($cursor);
            }
        }

        /* Освобождение ресурсов */
        oci_free_statement($statement);
        oci_free_statement($cursor);

        /* Возврат результата */
        echo json_encode($result);
    };





    /* Функция редактирования типа контрагента  */
    function edit_contractor_type ($postdata) {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $typeId = $postdata -> data -> typeId;
        $title = $postdata -> data -> title;
        $result = array();

        if (!$statement = oci_parse($connection, "begin PKG_CONTRACTORS.P_EDIT_CONTRACTOR_TYPE(:type_id, :title, :edited_type ); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":type_id", $typeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":title", $title, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":edited_type", $cursor, -1, OCI_B_CURSOR)) {
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
                } else
                    $result = oci_fetch_assoc($cursor);
            }
        }

        /* Освобождение ресурсов */
        oci_free_statement($statement);
        oci_free_statement($cursor);

        /* Возврат результата */
        echo json_encode($result);
    };




    /* Функция удаления типа контрагента */
    function delete_contractor_type ($postdata) {
        global $connection;
        $typeId = $postdata -> data -> typeId;
        $moment = 0;

        if (!$statement = oci_parse($connection, "begin PKG_CONTRACTORS.P_DELETE_CONTRACTOR_TYPE(:type_id, :moment); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":type_id", $typeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":moment", $moment, -1, OCI_B_INT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
        }

        // Освобождение ресурсов
        oci_free_statement($statement);
        // Возврат результата
        echo json_encode($moment);
    };





    /* Функция получения всех титулов */
    function get_contractors () {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_contractors.p_get_contractors(:contractors); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":contractors", $cursor, -1, OCI_B_CURSOR)) {
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
                    while ($contractor = oci_fetch_assoc($cursor))
                        array_push($result, $contractor);
                }
            }
        }

        /* Освобождение ресурсов */
        oci_free_statement($statement);
        oci_free_statement($cursor);

        /* Возврат результата */
        echo json_encode($result);
    };




    /* Функция добавления контрагента */
    function add_contractor ($postdata) {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $contractorTypeId = $postdata -> data -> contractorTypeId;
        $title = $postdata -> data -> title;
        $fullTitle = $postdata -> data -> fullTitle;
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_contractors.p_add_contractor(:type_id, :title, :full_title, :new_contractor); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":type_id", $contractorTypeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":title", $title, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":full_title", $fullTitle, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":new_contractor", $cursor, -1, OCI_B_CURSOR)) {
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
                } else
                    $result = oci_fetch_assoc($cursor);
                }
            }

        /* Освобождение ресурсов */
        oci_free_statement($statement);
        oci_free_statement($cursor);
        /* Возврат результата */
        echo json_encode($result);
    };




    /* Функция редактирования типа контрагента  */
    function edit_contractor ($postdata) {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $contractorId = $postdata -> data -> contractorId;
        $contractorTypeId = $postdata -> data -> contractorTypeId;
        $title = $postdata -> data -> title;
        $fullTitle = $postdata -> data -> fullTitle;
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_contractors.p_edit_contractor(:contractor_id, :type_id, :title, :full_title, :edited_contractor); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":contractor_id", $contractorId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":type_id", $contractorTypeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":title", $title, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":full_title", $fullTitle, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":edited_contractor", $cursor, -1, OCI_B_CURSOR)) {
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
                } else
                    $result = oci_fetch_assoc($cursor);
            }
        }

        /* Освобождение ресурсов */
        oci_free_statement($statement);
        oci_free_statement($cursor);
        /* Возврат результата */
        echo json_encode($result);
    };





?>