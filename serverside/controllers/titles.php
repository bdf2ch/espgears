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
                /* Добавление титула */
                case "add":
                    add_title($postdata);
                    break;
                /* Изменение титула */
                case "edit":
                    edit_title($postdata);
                    break;
                /* Удаление титула */
                case "delete":
                    delete_group($postdata);
                    break;
                /* Получение всех титулов */
                case "query":
                    get_titles();
                    break;
                /* Получение титула по идентификатору */
                case "getTituleById":
                    get_path($postdata);
                    break;
            }
        }
        oci_close($connection);
    //}



    /* Функция добавления группы */
    function add_title ($postdata) {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $data = $postdata -> data;
        $startNodeTypeId = $postdata -> data -> startNodeTypeId;
        $endNodeTypeId = $postdata -> data -> endNodeTypeId;
        $startPointId = $postdata -> data -> startPointId;
        $endPointId = $postdata -> data -> endPointId;
        $startNodeId = $postdata -> data -> startNodeId;
        $endNodeId = $postdata -> data -> endNodeId;
        $title = $postdata -> data -> title;
        $description = $postdata -> data -> description;

        //$result = new stdClass;

        if (!$statement = oci_parse($connection, "begin pkg_titules.p_insert_titule(:ttl_start_object_type_id, :ttl_end_object_type_id, :ttl_start_object_point_id, :ttl_end_object_point_id, :ttl_start_object_id, :ttl_end_object_id, :title, :description, :new_title); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":ttl_start_object_type_id", $startNodeTypeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":ttl_end_object_type_id", $endNodeTypeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":ttl_start_object_point_id", $startPointId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":ttl_end_object_point_id", $endPointId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":ttl_start_object_id", $startNodeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":ttl_end_object_id", $endNodeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":title", $title, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":description", $description, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":new_title", $cursor, -1, OCI_B_CURSOR)) {
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
                    $result = oci_fetch_object($cursor);
                }
            }

        }

        // Освобождение ресурсов
        oci_free_statement($statement);
        oci_free_statement($cursor);

        // Возврат результата
        echo json_encode($result);
    };



    /* Функция изменения группы */
    function edit_titule ($postdata) {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $data = $postdata -> data;
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_titules.p_edit_titule(:ttl_id, :ttl_start_object_type_id, :ttl_end_object_type_id, :ttl_start_point_id, :ttl_end_point_id, :ttl_start_object_id, :ttl_end_object_id, :ttl_name, :ttl_name_extra, :edited_ttl); end;")) {
            $error = oci_error();
            echo $error["message"];
        } else {
            if (!oci_bind_by_name($statement, ":ttl_id", $data -> id, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":ttl_start_object_type_id", $data -> startObjectTypeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":ttl_end_object_type_id", $data -> endObjectTypeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":ttl_start_point_id", $data -> startPointId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":ttl_end_point_id", $data -> endPointId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":ttl_start_object_id", $data -> startObjectId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":ttl_end_object_id", $data -> endObjectId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":ttl_name", $data -> title, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":ttl_name_extra", $data -> description, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":edited_ttl", $cursor, -1, OCI_B_CURSOR)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                echo $error["message"];
            } else {
                if (!oci_execute($cursor)) {
                    $error = oci_error();
                    echo $error["message"];
                } else {
                    while ($titule = oci_fetch_assoc($cursor))
                        array_push($result, $titule);
                }
            }
        }

        // Освобождение ресурсов
        oci_free_statement($statement);
        oci_free_statement($cursor);

        // Возврат результата
        if (sizeof($result) == 0)
            echo json_encode(0);
        else
            echo json_encode($result);
    };



    /* Функция удаления группы */
    function delete_group ($postdata) {
        global $connection;
        $data = $postdata -> data;
        $moment = 0;

        if (!$statement = oci_parse($connection, "begin pkg_usergroups.p_delete_group(:group_id, :moment); end;")) {
            $error = oci_error();
            echo $error["message"];
        } else {
            if (!oci_bind_by_name($statement, ":group_id", $data -> id, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":moment", $moment, -1, OCI_B_INT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                echo $error["message"];
            }
        }

        // Освобождение ресурсов
        oci_free_statement($statement);

        // Возврат результата
        echo json_encode($moment);
    };



    /* Функция получения всех титулов */
    function get_titles () {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_titules.p_get_titules(:data); end;")) {
            $error = oci_error();
            echo $error["message"];
        } else {
            if (!oci_bind_by_name($statement, ":data", $cursor, -1, OCI_B_CURSOR)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                echo $error["message"];
            } else {
                if (!oci_execute($cursor)) {
                    $error = oci_error();
                    echo $error["message"];
                } else {
                    while ($data = oci_fetch_assoc($cursor))
                        array_push($result, $data);
                }
            }
        }

        /* Освобождение ресурсов */
        oci_free_statement($statement);
        oci_free_statement($cursor);

        /* Возврат результата */
        if (sizeof($result) == 0)
            echo json_encode(0);
        else
            echo json_encode($result);
    };


    /* Функция получения объектов титула */
    function get_path ($postdata) {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $data = $postdata -> data;
        $result = array();

        if (!$statement = oci_parse($connection, "begin PKG_PATHS.p_get_path(:p_titule_id, :p_titule_part_id, :p_node_id, :p_path_id, :session_id, :p_nodes); end;")) {
            $error = oci_error();
            echo $error["message"];
        } else {
            if (!oci_bind_by_name($statement, ":p_titule_id", $data -> tituleId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":p_titule_part_id", $data -> titulePartId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":p_node_id", $data -> nodeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":p_path_id", $data -> pathId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":session_id", $data -> sessionId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":p_nodes", $cursor, -1, OCI_B_CURSOR)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                echo $error["message"];
            } else {
                if (!oci_execute($cursor)) {
                    $error = oci_error();
                    echo $error["message"];
                } else {
                    while ($node = oci_fetch_assoc($cursor))
                        array_push($result, $node);
                }
            }
        }

        /* Освобождение ресурсов */
        oci_free_statement($statement);
        oci_free_statement($cursor);

        /* Возврат результата */
        if (sizeof($result) == 0)
            echo json_encode(0);
        else
            echo json_encode($result);

    };

?>