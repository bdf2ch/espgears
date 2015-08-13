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
                /* Получение пути между двумя заданными узлами */
                //case "getNodesByTituleId":
                //    get_nodes_by_titule_id($postdata);
                //    break;

                /* Возвращает все типы узлов */
                case "getNodeTypes":
                    get_node_types();
                    break;

                /* Получение дочерних узлов по id узла */
                //case "getChildNodes":
                //    get_child_nodes($postdata);
                //    break;

                /* Получает узлы, вхоядящие в состав путей, исходящих из заданного узла */
                //case "getBranches":
                //    get_branches($postdata);
                //    break;

                //case "change":
                //    change_node($postdata);
                //    break;

                //case "add":
                //    add_node($postdata);
                //    break;

                //case "delete":
                //    delete_node($postdata);
                //    break;
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

?>