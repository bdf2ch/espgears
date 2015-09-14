<?php
    //if (!$_COOKIE["user"])
    //            die("Неавторизованный доступ!");
    //else {
        include "../config.php";
        $postdata = json_decode(file_get_contents('php://input'));

        $action = $postdata -> action;
        $result = array();

        /* Подключение к БД */
        $connection = oci_connect($db_user, $db_password, $db_host, 'AL32UTF8');
        if (!$connection){
            oci_close($connection);
            print_r(oci_error());
            die('Не удалось подключиться к БД');
        } else {
            switch ($action) {
                /* Возвращает все типы узлов */
                case "getNodeTypes":
                    get_node_types();
                    break;
                case "getPylonsByPowerLineId":
                    get_pylons_by_power_line_id ($postdata);
                    break;
                /* Получает узлы, вхоядящие в состав путей, исходящих из заданного узла */
                case "getBranches":
                    get_branches($postdata);
                    break;
                /* Добавление узла в сеть */
                case "addNode":
                    add_node($postdata);
                    break;
                /* Редактирование опоры */
                case "editNode":
                    edit_node($postdata);
                    break;
            }
            oci_close($connection);
        }
    //}


    function get_node_types () {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $result = array();

        if (!$statement = oci_parse($connection, "begin PKG_OBJECT_TYPES.P_GET_OBJECT_TYPES(:node_types); end;")) {
            $error = oci_error();
            echo $error["message"];
        } else {
            if (!oci_bind_by_name($statement, ":node_types", $cursor, -1, OCI_B_CURSOR)) {
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

        // Освобождение ресурсов
        oci_free_statement($statement);
        oci_free_statement($cursor);

        // Возврат результата
        if (sizeof($result) == 0)
            echo json_encode(0);
        else
            echo json_encode($result);
    };



    function get_pylons_by_power_line_id ($postdata) {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $result = array();
        $powerLineId = $postdata -> data -> powerLineId;

        if (!$statement = oci_parse($connection, "begin PKG_PYLONS.P_GET_PYLONS_BY_POWER_LINE(:pl_id, :pylons); end;")) {
            $error = oci_error();
            echo $error["message"];
        } else {
            if (!oci_bind_by_name($statement, ":pl_id", $powerLineId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":pylons", $cursor, -1, OCI_B_CURSOR)) {
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
                    while ($pylon = oci_fetch_assoc($cursor))
                        array_push($result, $pylon);
                }
            }
        }

        // Освобождение ресурсов
        oci_free_statement($statement);
        oci_free_statement($cursor);

        // Возврат результата
        echo json_encode($result);
    };


    /* Получает узлы, вхоядящие в состав путей, исходящих из заданного узла */
    function get_branches ($postdata) {
        global $connection;
        $titleId = $postdata -> data -> titleId;
        $titlePartId = $postdata -> data -> titlePartId;
        $nodeId = $postdata -> data -> nodeId;
        $sessionId = $postdata -> data -> sessionId;
        $cursor = oci_new_cursor($connection);
        $result = array();

        if (!$statement = oci_parse($connection, "begin PKG_NODES.P_GET_BRANCHES(:title_id, :title_part_id, :node_id, :session_id, :nodes); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":title_id", $titleId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":title_part_id", $titlePartId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":node_id", $nodeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":session_id", $sessionId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":nodes", $cursor, -1, OCI_B_CURSOR)) {
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

        // Освобождение ресурсов
        oci_free_statement($statement);
        oci_free_statement($cursor);

        // Возврат результата
        echo json_encode($result);
    };





/* Добавление узла в сеть*/
function add_node ($postdata) {
    global $connection;
    $cursor = oci_new_cursor($connection);
    $nodeTypeId = $postdata -> data -> nodeTypeId;
    $pointId = 0;
    $number = $postdata -> data -> number;
    $powerLineId = $postdata -> data -> powerLineId;
    $pylonTypeId = $postdata -> data -> pylonTypeId;
    $pylonSchemeTypeId = 0;
    $result = array();

    if (!$statement = oci_parse($connection, "begin PKG_NODES.P_ADD_NODE(:n_node_type_id, :n_point_id, :n_pylon_type_id, :n_pylon_scheme_type_id, :n_power_line_id, :n_pylon_number, :n_node); end;")) {
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!oci_bind_by_name($statement, ":n_node_type_id", $nodeTypeId, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":n_point_id", $pointId, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":n_pylon_type_id", $pylonTypeId, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":n_pylon_scheme_type_id", $pylonSchemeTypeId, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":n_power_line_id", $powerLineId, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":n_pylon_number", $number, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":n_node", $cursor, -1, OCI_B_CURSOR)) {
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
                $result = oci_fetch_assoc($cursor);
            }
        }
    }

    // Освобождение ресурсов
    oci_free_statement($statement);
    oci_free_statement($cursor);
    // Возврат результата
    echo json_encode($result);
};



/* Редактирование опоры */
function edit_node ($postdata) {
    global $connection;
    $cursor = oci_new_cursor($connection);
    $nodeId = $postdata -> data -> nodeId;
    $nodeTypeId = $postdata -> data -> nodeTypeId;
    $number = $postdata -> data -> number;
    $powerLineId = $postdata -> data -> powerLineId;
    $pylonTypeId = $postdata -> data -> pylonTypeId;
    $pylonSchemeTypeId = 0;
    $result = array();

    if (!$statement = oci_parse($connection, "begin PKG_NODES.P_EDIT_NODE(:node_id, :node_type_id, :pylon_number, :power_line_id, :pylon_type_id, :pylon_scheme_type_id, :edited_node); end;")) {
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!oci_bind_by_name($statement, ":node_id", $nodeId, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":node_type_id", $nodeTypeId, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":pylon_number", $number, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":power_line_id", $powerLineId, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":pylon_type_id", $pylonTypeId, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":pylon_scheme_type_id", $pylonSchemeTypeId, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":edited_node", $cursor, -1, OCI_B_CURSOR)) {
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
                $result = oci_fetch_assoc($cursor);
            }
        }
    }

    // Освобождение ресурсов
    oci_free_statement($statement);
    oci_free_statement($cursor);
    // Возврат результата
    echo json_encode($result);
};

?>