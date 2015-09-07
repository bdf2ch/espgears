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
                /* Получение всех групп пользователей */
                case "getUserGroups":
                    get_user_groups();
                    break;
                /* Получение всех контрагентов */
                case "getUsers":
                    get_users();
                    break;
                /* Получение титула по идентификатору */
                case "getTituleById":
                    get_path($postdata);
                    break;
                case "getBoundaryNodes":
                    get_boundary_nodes($postdata);
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



    /* Функция получения всех групп пользователей */
    function get_user_groups () {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_usergroups.p_get_groups(:user_groups); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":user_groups", $cursor, -1, OCI_B_CURSOR)) {
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
                    while ($user_group = oci_fetch_assoc($cursor))
                        array_push($result, $user_group);
                }
            }
        }

        /* Освобождение ресурсов */
        oci_free_statement($statement);
        oci_free_statement($cursor);

        /* Возврат результата */
        echo json_encode($result);
    };



    /* Функция получения всех пользователей */
    function get_users () {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_users.p_get_users(:users); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":users", $cursor, -1, OCI_B_CURSOR)) {
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
                    while ($user = oci_fetch_assoc($cursor))
                        array_push($result, $user);
                }
            }
        }

        /* Освобождение ресурсов */
        oci_free_statement($statement);
        oci_free_statement($cursor);

        /* Возврат результата */
        echo json_encode($result);
    };


    /* Функция добавления пользователя */
    function add_user ($postdata) {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $name = $postdata -> data -> name;
        $fname = $postdata -> data -> fname;
        $surname = $postdata -> data -> surname;
        $groupId = $postdata -> data -> groupId;
        $email = $postdata -> data -> email;
        $phone = $postdata -> data -> phone;
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_users.p_insert_user(:group_id, :name, :fname, :surname, :phone, :email, :passwd, :new_user ); end;")) {
            $error = oci_error();
            echo $error["message"];
        } else {
                if (!oci_bind_by_name($statement, ":group_id", $data -> groupId, -1, OCI_DEFAULT)) {
                    $error = oci_error();
                    echo $error["message"];
                }
                if (!oci_bind_by_name($statement, ":name", $data -> name, -1, OCI_DEFAULT)) {
                    $error = oci_error();
                    echo $error["message"];
                }
                if (!oci_bind_by_name($statement, ":fname", $data -> fname, -1, OCI_DEFAULT)) {
                    $error = oci_error();
                    echo $error["message"];
                }
                if (!oci_bind_by_name($statement, ":surname", $data -> surname, -1, OCI_DEFAULT)) {
                    $error = oci_error();
                    echo $error["message"];
                }
                if (!oci_bind_by_name($statement, ":phone", $data -> phone, -1, OCI_DEFAULT)) {
                    $error = oci_error();
                    echo $error["message"];
                }
                if (!oci_bind_by_name($statement, ":email", $data -> email, -1, OCI_DEFAULT)) {
                    $error = oci_error();
                    echo $error["message"];
                }
                if (!oci_bind_by_name($statement, ":passwd", $data -> password, -1, OCI_DEFAULT)) {
                    $error = oci_error();
                    echo $error["message"];
                }
                if (!oci_bind_by_name($statement, ":new_user", $cursor, -1, OCI_B_CURSOR)) {
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
                        while ($user = oci_fetch_assoc($cursor))
                            array_push($result, $user);
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

?>