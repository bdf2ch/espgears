<?php

    //if (!$_COOKIE["user"])
    //    die("Неавторизованный доступ!");
    //else {
        include "../config.php";
        include "../core.php";
        $postdata = json_decode(file_get_contents('php://input'));

        $action = $postdata -> action;

        /* Подключение к БД */
        $connection = oci_connect($db_user, $db_password, $db_host, 'AL32UTF8');
        if (!$connection){
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            switch ($action) {
                /* Возвращает все линии */
                case "getPowerLines":
                    get_power_lines();
                    break;
                /* Добавление линии */
                case "addPowerLine":
                    add_power_line($postdata);
                    break;
                /* Редактирование линии */
                case "editPowerLine":
                    edit_power_line($postdata);
                    break;
                /* Возвращает все типы кабеля */
                case "getCableTypes":
                    get_cable_types();
                    break;
            }
            oci_close($connection);
        }
    //}



function get_power_lines () {
    global $connection;
    $cursor = oci_new_cursor($connection);
    $result = array();

    if (!$statement = oci_parse($connection, "begin PKG_POWER_LINES.P_GET_POWER_LINES(:power_lines); end;")) {
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!oci_bind_by_name($statement, ":power_lines", $cursor, -1, OCI_B_CURSOR)) {
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
                while ($powerline = oci_fetch_assoc($cursor))
                    array_push($result, $powerline);
            }
        }
    }

    // Освобождение ресурсов
    oci_free_statement($statement);
    oci_free_statement($cursor);

    // Возврат результата
    echo json_encode($result);
};




    /* Добавление линии */
    function add_power_line ($postdata) {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $title = $postdata -> data -> title;
        $voltage = $postdata -> data -> voltage;
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_power_lines.p_insert_power_line(:title, :voltage, :new_line ); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":title", $title, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":voltage", $voltage, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":new_line", $cursor, -1, OCI_B_CURSOR)) {
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

        /* Освобождение ресурсов */
        oci_free_statement($statement);
        oci_free_statement($cursor);

        /* Возврат результата */
        echo json_encode($result);
    };




/* Редактирование линии */
function edit_power_line ($postdata) {
    global $connection;
    $cursor = oci_new_cursor($connection);
    $powerLineId = $postdata -> data -> powerLineId;
    $title = $postdata -> data -> title;
    $voltage = $postdata -> data -> voltage;
    $result = array();

    if (!$statement = oci_parse($connection, "begin pkg_power_lines.p_edit_power_line(:power_line_id, :title, :voltage, :edited_power_line ); end;")) {
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!oci_bind_by_name($statement, ":power_line_id", $powerLineId, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":title", $title, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":voltage", $voltage, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":edited_power_line", $cursor, -1, OCI_B_CURSOR)) {
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





function get_cable_types () {
    global $connection;
    $cursor = oci_new_cursor($connection);
    $result = array();

    if (!$statement = oci_parse($connection, "begin PKG_CABLE_TYPES.P_GET_CABLE_TYPES(:cable_types); end;")) {
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!oci_bind_by_name($statement, ":cable_types", $cursor, -1, OCI_B_CURSOR)) {
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
                while ($cable_type = oci_fetch_assoc($cursor))
                    array_push($result, $cable_type);
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