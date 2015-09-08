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
                case "addTitle":
                    add_title($postdata);
                    break;
                /* Изменение титула */
                case "editTitle":
                    edit_title($postdata);
                    break;
                /* Получение всех титулов */
                case "getTitles":
                    get_titles();
                    break;
                /* Получение узлов титула */
                case "getTitleNodes":
                    get_title_nodes($postdata);
                    break;
                case "getBoundaryNodes":
                    get_boundary_nodes($postdata);
                    break;
                /* Получение всех статусов титула */
                case "getStatuses":
                    get_statuses ();
                    break;
                case "getBuildingPlans":
                    get_building_plans();
                    break;
                case "getBuildingStatuses":
                    get_building_statuses();
                    break;
            }
        }
        oci_close($connection);
    //}


       /* Функция получения всех титулов */
    function get_titles () {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_titules.p_get_titules(:data); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":data", $cursor, -1, OCI_B_CURSOR)) {
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
                    while ($title = oci_fetch_assoc($cursor))
                        array_push($result, $title);
                }
            }
        }

        /* Освобождение ресурсов */
        oci_free_statement($statement);
        oci_free_statement($cursor);

        /* Возврат результата */
        echo json_encode($result);
    };


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
    function edit_title ($postdata) {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $id = $postdata -> data -> id;
        $startNodeTypeId = $postdata -> data -> startNodeTypeId;
        $endNodeTypeId = $postdata -> data -> endNodeTypeId;
        $startPointId = $postdata -> data -> startPointId;
        $endPointId = $postdata -> data -> endPointId;
        $startNodeId = $postdata -> data -> startNodeId;
        $endNodeId = $postdata -> data -> endNodeId;
        $title = $postdata -> data -> title;
        $description = $postdata -> data -> description;
        $result = new stdClass;

        if (!$statement = oci_parse($connection, "begin pkg_titules.p_edit_titule(:ttl_id, :ttl_start_node_type_id, :ttl_end_node_type_id, :ttl_start_point_id, :ttl_end_point_id, :ttl_start_node_id, :ttl_end_node_id, :ttl_title, :ttl_description, :edited_ttl); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":ttl_id", $id, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":ttl_start_node_type_id", $startNodeTypeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":ttl_end_node_type_id", $endNodeTypeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":ttl_start_point_id", $startPointId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":ttl_end_point_id", $endPointId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":ttl_start_node_id", $startNodeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":ttl_end_node_id", $endNodeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":ttl_title", $title, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":ttl_description", $description, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":edited_ttl", $cursor, -1, OCI_B_CURSOR)) {
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
                    //while ($titule = oci_fetch_assoc($cursor))
                        //array_push($result, $titule);
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



    /* Функция получения объектов титула */
    function get_title_nodes ($postdata) {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $titleId = $postdata -> data -> titleId;
        $titlePartId = $postdata -> data -> titlePartId;
        $nodeId = $postdata -> data -> nodeId;
        $branchId = $postdata -> data -> branchId;
        $sessionId = $postdata -> data -> sessionId;
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_paths.p_get_path(:p_title_id, :p_title_part_id, :p_node_id, :p_branch_id, :session_id, :p_nodes); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":p_title_id", $titleId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":p_title_part_id", $titlePartId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":p_node_id", $nodeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":p_branch_id", $branchId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":session_id", $sessionId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":p_nodes", $cursor, -1, OCI_B_CURSOR)) {
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
                    while ($node = oci_fetch_assoc($cursor))
                        array_push($result, $node);
                }
            }
        }

        /* Освобождение ресурсов */
        oci_free_statement($statement);
        oci_free_statement($cursor);

        /* Возврат результата */
        echo json_encode($result);
    };


    function get_boundary_nodes ($postdata) {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $id = $postdata -> data -> id;
        $result = array();;

        if (!$statement = oci_parse($connection, "begin PKG_TITULES.p_get_boundary_nodes(:p_title_id, :p_boundary_nodes); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":p_title_id", $id, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":p_boundary_nodes", $cursor, -1, OCI_B_CURSOR)) {
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
                    while ($node = oci_fetch_assoc($cursor))
                        array_push($result, $node);
                }
            }
        }

        /* Освобождение ресурсов */
        oci_free_statement($statement);
        oci_free_statement($cursor);

        /* Возврат результата */
        echo json_encode($result);
    };


    function get_statuses () {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_statuses.p_get_statuses(:data); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":data", $cursor, -1, OCI_B_CURSOR)) {
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
                    while ($status = oci_fetch_assoc($cursor))
                        array_push($result, $status);
                }
            }
        }

        /* Освобождение ресурсов */
        oci_free_statement($statement);
        oci_free_statement($cursor);

        /* Возврат результата */
        echo json_encode($result);
    };


    /**
    * Возвращает список всех этапов планов строительства всех титулов
    **/
    function get_building_plans () {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_titules.p_get_building_plans(:plans); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":plans", $cursor, -1, OCI_B_CURSOR)) {
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
                    while ($plan = oci_fetch_assoc($cursor))
                        array_push($result, $plan);
                }
            }
        }

        /* Освобождение ресурсов */
        oci_free_statement($statement);
        oci_free_statement($cursor);

        /* Возврат результата */
        echo json_encode($result);
    };


    /**
    * Возвращает список всех этапов планов строительства всех титулов
    **/
    function get_building_statuses () {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_titules.p_get_building_statuses(:building_statuses); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":building_statuses", $cursor, -1, OCI_B_CURSOR)) {
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
                    while ($building_status = oci_fetch_assoc($cursor))
                        array_push($result, $building_status);
                }
            }
        }

        /* Освобождение ресурсов */
        oci_free_statement($statement);
        oci_free_statement($cursor);

        /* Возврат результата */
        echo json_encode($result);
    };

?>