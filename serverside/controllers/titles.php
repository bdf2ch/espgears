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
                /* Получение всех титулов */
                case "getTitles":
                    get_titles();
                    break;
                /* Добавление титула */
                case "addTitle":
                    add_title($postdata);
                    break;
                /* Изменение титула */
                case "editTitle":
                    edit_title($postdata);
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
                /* Добавление этапа плана работ строительства титула */
                case "addBuildingPlan":
                    add_building_plan_item($postdata);
                    break;
                /* Изменение этапа работ плана строительства титула */
                case "editBuildingPlan":
                    edit_building_plan($postdata);
                    break;
                /* Удаление этапа работ плана строительства титула */
                case "deleteBuildingPlan":
                    delete_building_plan($postdata);
                    break;
                /* Получение всех статусов этапа плана строительства титула */
                case "getBuildingStatuses":
                    get_building_statuses();
                    break;
                case "getContractors":
                    get_contractors();
                    break;
                /* Добавление заявки */
                case "addRequest":
                    add_request($postdata);
                    break;
                /* Добавляет файл технических условий к заявке */
                case "addRequestTUDoc":
                    add_request_tu_doc($postdata);
                    break;
                /* Скачивает файл технических условий */
                case "downloadRequestTU":
                    download_tu_doc($postdata);
                    break;
                /* Получение истории изменения статуса заявки */
                case "getRequestHistory":
                    get_request_history($postdata);
                    break;
                /* Меняет статус заявки */
                case "changeRequestStatus":
                    change_request_status($postdata);
                    break;
                /* Получение списка всех рабочих коммиссий */
                case "getWorkingCommissions":
                    get_working_commissions();
                    break;
                /* Добавление рабочей коммиссии */
                case "addWorkingCommission":
                    add_working_commission($postdata);
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





    function add_building_plan_item ($postdata) {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $titleId = $postdata -> data -> titleId;
        $statusId = $postdata -> data -> statusId;
        $title = $postdata -> data -> title;
        $description = $postdata -> data -> description;
        $start = $postdata -> data -> start;
        $end = $postdata -> data -> end;
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_titules.p_add_building_plan(:title_id, :status_id, :title, :description, :start, :end, :new_plan); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":title_id", $titleId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":status_id", $statusId, -1, OCI_DEFAULT)) {
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
            if (!oci_bind_by_name($statement, ":start", $start, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":end", $end, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":new_plan", $cursor, -1, OCI_B_CURSOR)) {
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
                    $result = oci_fetch_object($cursor);
            }

        }

        // Освобождение ресурсов
        oci_free_statement($statement);
        oci_free_statement($cursor);

        // Возврат результата
        echo json_encode($result);
    };





    function edit_building_plan ($postdata) {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $planId = $postdata -> data -> planId;
        $statusId = $postdata -> data -> statusId;
        $title = $postdata -> data -> title;
        $description = $postdata -> data -> description;
        $start = $postdata -> data -> start;
        $end = $postdata -> data -> end;
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_titules.p_edit_building_plan(:plan_id, :status_id, :title, :description, :start, :end, :edited_plan); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":plan_id", $planId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":status_id", $statusId, -1, OCI_DEFAULT)) {
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
            if (!oci_bind_by_name($statement, ":start", $start, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":end", $end, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":edited_plan", $cursor, -1, OCI_B_CURSOR)) {
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
                    $result = oci_fetch_object($cursor);
            }

        }

        // Освобождение ресурсов
        oci_free_statement($statement);
        oci_free_statement($cursor);

        // Возврат результата
        echo json_encode($result);
    };



    /* Удаляет этап работ плана строительства титула */
    function delete_building_plan ($postdata) {
        global $connection;
        $planId = $postdata -> data -> planId;
        $moment = 0;

        if (!$statement = oci_parse($connection, "begin pkg_titules.p_delete_building_plan(:plan_id, :moment); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":plan_id", $planId, -1, OCI_DEFAULT)) {
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





    /* Функция получения всех титулов */
    function get_contractors () {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_titules.p_get_titles_contractors(:contractors); end;")) {
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





function add_request ($postdata) {
    global $connection;
    $cursor = oci_new_cursor($connection);
    $buildingPlanDate = $postdata -> data -> buildingPlanDate;
    $curatorId = $postdata -> data -> curatorId;
    $requestTypeId = $postdata -> data -> requestTypeId;
    $userId = $postdata -> data -> userId;
    $investorId = $postdata -> data -> investorId;
    $title = $postdata -> data -> title;
    $resources = $postdata -> data -> resources;
    $result = stdClass;

    if (!$statement = oci_parse($connection, "begin pkg_titules.p_add_request(:request_type_id, :user_id, :investor_id, :curator_id, :title, :building_plan_date, :resources, :description, :new_request); end;")) {
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!oci_bind_by_name($statement, ":request_type_id", $requestTypeId, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":user_id", $userId, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":investor_id", $investorId, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":curator_id", $curatorId, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":title", $title, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":building_plan_date", $buildingPlanDate, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":resources", $resources, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":description", $description, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":new_request", $cursor, -1, OCI_B_CURSOR)) {
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
                    $result = oci_fetch_object($cursor);
            }
    }

    // Освобождение ресурсов
    oci_free_statement($statement);
    oci_free_statement($cursor);
    // Возврат результата
    echo json_encode($result);
};



function add_request_tu_doc($postdata) {
    global $connection;
    $requestId = $postdata -> data -> requestId;
    $result = stdClass;

    if (isset($_FILES["request_tu_upload"]["tmp_name"])) {
        $result -> title = $_FILES["request_tu_upload"]["name"];
        $result -> type = $_FILES["request_tu_upload"]["type"];
        $result -> size = $_FILES["request_tu_upload"]["size"];


        if (!$statement = oci_parse($connection, "begin pkg_titules.p_add_tu_doc(:request_id, :blob); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            $blob = oci_new_descriptor($connection, OCI_D_LOB);
            if (!oci_bind_by_name($statement, ":request_id", $requestId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":blob", $cursor, -1, OCI_B_CURSOR)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }

            // Освобождение ресурсов
            oci_free_statement($statement);
            $blob -> free();
        }
    }

    // Возврат результата
    echo json_encode($result);
};





function download_tu_doc ($postdata) {
    global $connection;
    $requestId = $postdata -> data -> requestId;
    //$cursor = oci_new_cursor($connection);
    //$fileTitle = "";
    //$fileSize = 0;
    //$fileType = "";
    //$fileContent = oci_new_descriptor($connection, OCI_D_LOB);

    //if (!$statement = oci_parse($connection, "begin pkg_titules.p_download_tu_doc(:request_id, :file_content); end;")) {
    //    $error = oci_error();
    //    $result = new DBError($error["code"], $error["message"]);
    //    echo(json_encode($result));
    //} else {
    //    if (!oci_bind_by_name($statement, ":request_id", $requestId, -1, OCI_DEFAULT)) {
    //        $error = oci_error();
    //        $result = new DBError($error["code"], $error["message"]);
    //        echo(json_encode($result));
    //    }
        //if (!oci_bind_by_name($statement, ":file_title", $fileTitle, 500, SQLT_CHR)) {
        //    $error = oci_error();
        //    $result = new DBError($error["code"], $error["message"]);
        //    echo(json_encode($result));
        //}
        //if (!oci_bind_by_name($statement, ":file_size", $fileSize, 20, OCI_B_INT)) {
        //    $error = oci_error();
        //    $result = new DBError($error["code"], $error["message"]);
        //    echo(json_encode($result));
        //}
        //if (!oci_bind_by_name($statement, ":file_type", $fileType, 500, SQLT_CHR)) {
        //    $error = oci_error();
        //    $result = new DBError($error["code"], $error["message"]);
        //   echo(json_encode($result));
        //}
        //if (!oci_bind_by_name($statement, ":file_content", $fileContent, -1, OCI_B_BLOB)) {
        //    $error = oci_error();
        //    $result = new DBError($error["code"], $error["message"]);
        //    echo(json_encode($result));
        //}
        //if (!oci_execute($statement)) {
        //    $error = oci_error();
        //    $result = new DBError($error["code"], $error["message"]);
        //    echo(json_encode($result));
        //} else {
            //echo("fileType done = ".$fileType);
            //if (!oci_execute($cursor)) {
            //    $error = oci_error();
            //    $result = new DBError($error["code"], $error["message"]);
            //   echo(json_encode($result));
            //} else {
                //$tu = oci_fetch_assoc($cursor);
                //print_r($fileContent);
                //header('Content-Description: File Transfer');
                //header('Content-Type: application/octet-stream');
                //header('Content-Type: '.'dasdas/dasda');
                //header('Content-Disposition: attachment; filename="'.'gffdg.txt'.'"');
                //header('Cache-Control: must-revalidate');
                //header('Pragma: public');
                //header('Content-Length: '.$fileSize);
                //echo $fileContent->read();
            //}
        //}



        if (!$statement = oci_parse($connection, "SELECT * FROM tu_docs WHERE request_id =:r_id")) {
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
                 print_r($tu);
                 header('Content-Description: File Transfer');
                 //header('Content-Type: application/octet-stream');
                 header('Content-Type: '.$tu["FILE_TYPE"]);
                 header('Content-Disposition: attachment; filename="'.$tu["FILE_TITLE"].'"');
                 header('Pragma: public');
                 //header('Content-Length: '.$fileSize);
                 echo $tu["FILE_CONTENT"]->load();
            }
        }


        // Освобождение ресурсов
        oci_free_statement($statement);
        //oci_free_statement($cursor);
    //}
};




function change_request_status ($postdata) {
    global $connection;
    $cursor = oci_new_cursor($connection);
    $requestId = $postdata -> data -> requestId;
    $statusId = $postdata -> data -> statusId;
    $userId = $postdata -> data -> userId;
    $result = stdClass;

    if (!$statement = oci_parse($connection, "begin pkg_titules.p_change_request_status(:request_id, :status_id, :user_id, :history); end;")) {
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!oci_bind_by_name($statement, ":request_id", $requestId, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":status_id", $statusId, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":user_id", $userId, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":history", $cursor, -1, OCI_B_CURSOR)) {
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
                $result = oci_fetch_object($cursor);
        }
    }

    // Освобождение ресурсов
    oci_free_statement($statement);
    oci_free_statement($cursor);
    // Возврат результата
    echo json_encode($result);
};


  /* Функция получения всех титулов */
function get_request_history($postdata) {
    global $connection;
    $cursor = oci_new_cursor($connection);
    $requestId = $postdata -> data -> requestId;
    $result = array();

    if (!$statement = oci_parse($connection, "begin pkg_titules.p_get_request_history(:r_id, :data); end;")) {
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!oci_bind_by_name($statement, ":r_id", $requestId, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
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
                while ($history = oci_fetch_assoc($cursor))
                    array_push($result, $history);
            }
        }
    }

    /* Освобождение ресурсов */
    oci_free_statement($statement);
    oci_free_statement($cursor);

    /* Возврат результата */
    echo json_encode($result);
};




/* Добавление рабочей коммиссии */
function get_working_commissions () {
    global $connection;
    $cursor = oci_new_cursor($connection);
    $result = array();

    if (!$statement = oci_parse($connection, "begin pkg_titules.p_get_working_commissions(:data); end;")) {
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
                while ($commission = oci_fetch_assoc($cursor))
                    array_push($result, $commission);
            }
        }
    }

    /* Освобождение ресурсов */
    oci_free_statement($statement);
    oci_free_statement($cursor);

    /* Возврат результата */
    echo json_encode($result);
};





function add_working_commission ($postdata) {
    global $connection;
    $cursor = oci_new_cursor($connection);
    $titleId = $postdata -> data -> titleId;
    $date = $postdata -> data -> date;
    $result = array();

    if (!$statement = oci_parse($connection, "begin pkg_titules.p_add_working_commission(:title_id, :date, :new_commission); end;")) {
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!oci_bind_by_name($statement, ":title_id", $titleId, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":date", $date, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":new_commission", $cursor, -1, OCI_B_CURSOR)) {
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
                $result = oci_fetch_object($cursor);
        }
    }

    // Освобождение ресурсов
    oci_free_statement($statement);
    oci_free_statement($cursor);
    // Возврат результата
    echo json_encode($result);
};

?>