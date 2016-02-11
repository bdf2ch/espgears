<?php

    //if (!$_COOKIE["user"])
    //    die("���������������� ������!");
    //else {
        include "../config.php";
        include "../core.php";
        $postdata = json_decode(file_get_contents('php://input'));

        $action = $postdata -> action;

        /* ����������� � �� */
        $connection = oci_connect($db_user, $db_password, $db_host, 'AL32UTF8');
        if (!$connection){
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            switch ($action) {
                /* ���������� ��� ����� */
                case "getPowerLines":
                    get_power_lines();
                    break;
                /* ���������� ����� */
                case "addPowerLine":
                    add_power_line($postdata);
                    break;
                /* �������������� ����� */
                case "editPowerLine":
                    edit_power_line($postdata);
                    break;
                /* ���������� ��� ���� ������ */
                case "getCableTypes":
                    get_cable_types();
                    break;
                /* ��������� ������ ���� ����� ���� */
                case "getPylonTypes":
                    get_pylon_types();
                    break;
                case "addPylonType":
                    add_pylon_type($postdata);
                    break;
                case "editPylonType":
                    edit_pylon_type($postdata);
                    break;
                case "deletePylonType":
                    delete_pylon_type($postdata);
                    break;
                case "addCableType":
                    add_cable_type($postdata);
                    break;
                case "editCableType":
                    edit_cable_type($postdata);
                    break;
                case "deleteCableType":
                    delete_cable_type($postdata);
                    break;
                case "addAnchorType":
                    add_anchor_type($postdata);
                    break;
                case "editAnchorType":
                    edit_anchor_type($postdata);
                    break;
                case "deleteAnchorType":
                    delete_anchor_type($postdata);
                    break;
                case "addVibroType":
                    add_vibro_type($postdata);
                    break;
                case "editVibroType":
                    edit_vibro_type($postdata);
                    break;
                case "deleteVibroType":
                    delete_vibro_type($postdata);
                    break;
            }
            oci_close($connection);
        }
    //}



function get_power_lines () {
    global $connection;
    $cursor = oci_new_cursor($connection);
    $result = array();

    if (!$statement = oci_parse($connection, "begin PKG_MISC.P_GET_POWER_LINES(:power_lines); end;")) {
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

    // ������������ ��������
    oci_free_statement($statement);
    oci_free_statement($cursor);

    // ������� ����������
    echo json_encode($result);
};




/* Добавление линии */
function add_power_line ($postdata) {
    global $connection;
    $cursor = oci_new_cursor($connection);
    $title = $postdata -> data -> title;
    $voltage = $postdata -> data -> voltage;
    $result = array();

    if (!$statement = oci_parse($connection, "begin PKG_MISC.P_ADD_POWER_LINE(:title, :voltage, :new_line ); end;")) {
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

    oci_free_statement($statement);
    oci_free_statement($cursor);
    echo json_encode($result);
};




/* Изменение линии */
function edit_power_line ($postdata) {
    global $connection;
    $cursor = oci_new_cursor($connection);
    $powerLineId = $postdata -> data -> powerLineId;
    $title = $postdata -> data -> title;
    $voltage = $postdata -> data -> voltage;
    $result = array();

    if (!$statement = oci_parse($connection, "begin PKG_MISC.P_EDIT_POWER_LINE(:power_line_id, :title, :voltage, :edited_power_line ); end;")) {
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

    oci_free_statement($statement);
    oci_free_statement($cursor);
    echo json_encode($result);
};





function get_cable_types () {
    global $connection;
    $cursor = oci_new_cursor($connection);
    $result = array();

    if (!$statement = oci_parse($connection, "begin PKG_MISC.P_GET_CABLE_TYPES(:cable_types); end;")) {
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

    oci_free_statement($statement);
    oci_free_statement($cursor);
    echo json_encode($result);
};




function get_pylon_types () {
    global $connection;
    $cursor = oci_new_cursor($connection);
    $result = array();

    if (!$statement = oci_parse($connection, "begin PKG_MISC.P_GET_PYLON_TYPES(:pylon_types); end;")) {
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!oci_bind_by_name($statement, ":pylon_types", $cursor, -1, OCI_B_CURSOR)) {
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
                while ($pylon_type = oci_fetch_assoc($cursor))
                    array_push($result, $pylon_type);
            }
        }
    }

    oci_free_statement($statement);
    oci_free_statement($cursor);
    echo json_encode($result);
};



/* Добавление типа опоры */
function add_pylon_type ($postdata) {
    global $connection;
    $cursor = oci_new_cursor($connection);
    $title = $postdata -> data -> title;
    $result = array();

    if (!$statement = oci_parse($connection, "begin PKG_MISC.P_ADD_PYLON_TYPE(:title, :new_pylon_type); end;")) {
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!oci_bind_by_name($statement, ":title", $title, -1, OCI_DEFAULT)) {
           $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":new_pylon_type", $cursor, -1, OCI_B_CURSOR)) {
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

    oci_free_statement($statement);
    oci_free_statement($cursor);
    echo json_encode($result);
};



/* Редактирование типа опоры */
function edit_pylon_type ($postdata) {
    global $connection;
    $cursor = oci_new_cursor($connection);
    $id = $postdata -> data -> id;
    $title = $postdata -> data -> title;
    $result = array();

    if (!$statement = oci_parse($connection, "begin PKG_MISC.P_EDIT_PYLON_TYPE(:id, :title, :edited_pylon_type); end;")) {
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!oci_bind_by_name($statement, ":id", $id, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":title", $title, -1, OCI_DEFAULT)) {
           $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":edited_pylon_type", $cursor, -1, OCI_B_CURSOR)) {
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

    oci_free_statement($statement);
    oci_free_statement($cursor);
    echo json_encode($result);
};



/* Удаление типа опоры */
function delete_pylon_type ($postdata) {
    global $connection;
    $id = $postdata -> data -> id;
    $result = "fail";

    if (!$statement = oci_parse($connection, "begin PKG_MISC.P_DELETE_PYLON_TYPE(:id, :answer); end;")) {
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!oci_bind_by_name($statement, ":id", $id, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":answer", $result, 50, SQLT_CHR)) {
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

    oci_free_statement($statement);
    oci_free_statement($cursor);
    echo json_encode($result);
};



/* Добавление типа кабеля */
function add_cable_type ($postdata) {
    global $connection;
    $cursor = oci_new_cursor($connection);
    $title = $postdata -> data -> title;
    $capacity = $postdata -> data -> capacity;
    $result = array();

    if (!$statement = oci_parse($connection, "begin PKG_MISC.P_ADD_CABLE_TYPE(:title, :full_title, :capacity, :color_code, :new_cable_type); end;")) {
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!oci_bind_by_name($statement, ":title", $title, -1, OCI_DEFAULT)) {
           $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":full_title", $full_title, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":capacity", $capacity, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":color_code", $color_code, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":new_cable_type", $cursor, -1, OCI_B_CURSOR)) {
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

    oci_free_statement($statement);
    oci_free_statement($cursor);
    echo json_encode($result);
};



/* Редактирование типа кабеля */
function edit_cable_type ($postdata) {
    global $connection;
    $cursor = oci_new_cursor($connection);
    $id = $postdata -> data -> id;
    $title = $postdata -> data -> title;
    $full_title = $postdata -> data -> fullTitle;
    $capacity = $postdata -> data -> capacity;
    $color_code = $postdata -> data -> colorCode;
    $result = array();

    if (!$statement = oci_parse($connection, "begin PKG_MISC.P_EDIT_CABLE_TYPE(:id, :title, :full_title, :capacity, :color_code, :edited_cable_type); end;")) {
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!oci_bind_by_name($statement, ":id", $id, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":title", $title, -1, OCI_DEFAULT)) {
           $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":full_title", $full_title, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":capacity", $capacity, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":color_code", $color_code, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":edited_cable_type", $cursor, -1, OCI_B_CURSOR)) {
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

    oci_free_statement($statement);
    oci_free_statement($cursor);
    echo json_encode($result);
};



/* Удаление типа кабеля */
function delete_cable_type ($postdata) {
    global $connection;
    $id = $postdata -> data -> id;
    $result = "fail";

    if (!$statement = oci_parse($connection, "begin PKG_MISC.P_DELETE_CABLE_TYPE(:id, :answer); end;")) {
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!oci_bind_by_name($statement, ":id", $id, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":answer", $result, 50, SQLT_CHR)) {
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

    oci_free_statement($statement);
    oci_free_statement($cursor);
    echo json_encode($result);
};



/* Добавление типа крепления */
function add_anchor_type ($postdata) {
    global $connection;
    $cursor = oci_new_cursor($connection);
    $title = $postdata -> data -> title;
    $result = array();

    if (!$statement = oci_parse($connection, "begin PKG_MISC.P_ADD_ANCHOR_TYPE(:title, :new_anchor_type); end;")) {
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!oci_bind_by_name($statement, ":title", $title, -1, OCI_DEFAULT)) {
           $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":new_anchor_type", $cursor, -1, OCI_B_CURSOR)) {
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

    oci_free_statement($statement);
    oci_free_statement($cursor);
    echo json_encode($result);
};





/* Редактирование типа крепления */
function edit_anchor_type ($postdata) {
    global $connection;
    $cursor = oci_new_cursor($connection);
    $id = $postdata -> data -> id;
    $title = $postdata -> data -> title;
    $result = array();

    if (!$statement = oci_parse($connection, "begin PKG_MISC.P_EDIT_ANCHOR_TYPE(:id, :title, :edited_anchor_type); end;")) {
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!oci_bind_by_name($statement, ":id", $id, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":title", $title, -1, OCI_DEFAULT)) {
           $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":edited_anchor_type", $cursor, -1, OCI_B_CURSOR)) {
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

    oci_free_statement($statement);
    oci_free_statement($cursor);
    echo json_encode($result);
};



/* Удаление типа крепления */
function delete_anchor_type ($postdata) {
    global $connection;
    $id = $postdata -> data -> id;
    $result = "fail";

    if (!$statement = oci_parse($connection, "begin PKG_MISC.P_DELETE_ANCHOR_TYPE(:id, :answer); end;")) {
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!oci_bind_by_name($statement, ":id", $id, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":answer", $result, 50, SQLT_CHR)) {
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

    oci_free_statement($statement);
    oci_free_statement($cursor);
    echo json_encode($result);
};



/* Добавление типа виброгасителя */
function add_vibro_type ($postdata) {
    global $connection;
    $cursor = oci_new_cursor($connection);
    $title = $postdata -> data -> title;
    $result = array();

    if (!$statement = oci_parse($connection, "begin PKG_MISC.P_ADD_VIBRO_TYPE(:title, :new_vibro_type); end;")) {
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!oci_bind_by_name($statement, ":title", $title, -1, OCI_DEFAULT)) {
           $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":new_vibro_type", $cursor, -1, OCI_B_CURSOR)) {
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

    oci_free_statement($statement);
    oci_free_statement($cursor);
    echo json_encode($result);
};



/* Редактирование типа виброгасителя */
function edit_vibro_type ($postdata) {
    global $connection;
    $cursor = oci_new_cursor($connection);
    $id = $postdata -> data -> id;
    $title = $postdata -> data -> title;
    $result = array();

    if (!$statement = oci_parse($connection, "begin PKG_MISC.P_EDIT_VIBRO_TYPE(:id, :title, :edited_vibro_type); end;")) {
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!oci_bind_by_name($statement, ":id", $id, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":title", $title, -1, OCI_DEFAULT)) {
           $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":edited_vibro_type", $cursor, -1, OCI_B_CURSOR)) {
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

    oci_free_statement($statement);
    oci_free_statement($cursor);
    echo json_encode($result);
};



/* Удаление типа виброгасителя */
function delete_vibro_type ($postdata) {
    global $connection;
    $id = $postdata -> data -> id;
    $result = "fail";

    if (!$statement = oci_parse($connection, "begin PKG_MISC.P_DELETE_VIBRO_TYPE(:id, :answer); end;")) {
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!oci_bind_by_name($statement, ":id", $id, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":answer", $result, 50, SQLT_CHR)) {
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

    oci_free_statement($statement);
    oci_free_statement($cursor);
    echo json_encode($result);
};

?>