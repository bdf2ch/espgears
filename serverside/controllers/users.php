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
                /* Получение всех групп пользователей */
                case "getUserGroups":
                    get_user_groups();
                    break;
                /* Добавление группы пользователей */
                case "addGroup":
                    add_group($postdata);
                    break;
                /* Редактирование группы пользователей */
                case "editGroup":
                    edit_group($postdata);
                    break;
                /* Удаление группы пользователей */
                case "deleteGroup":
                    delete_group($postdata);
                    break;
                /* Получение всех пользователей */
                case "getUsers":
                    get_users();
                    break;
                /* Добавление пользователя */
                case "addUser":
                    add_user($postdata);
                    break;
                /* Редактирование пользователя */
                case "editUser":
                    edit_user($postdata);
                    break;
                /* Удаление пользователя */
                case "deleteUser":
                    delete_user($postdata);
                    break;
                /* Получение прав пользователя */
                case "getPermissions":
                    get_user_permissions($postdata);
                    break;
                /* Добавление правила доступа к данным */
                case "setPermission":
                    set_permission($postdata);
                    break;
            }
        }
        oci_close($connection);
    //}



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





    /* Функция добавления группы пользователей */
    function add_group ($postdata) {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $title = $postdata -> data -> title;
        $description = $postdata -> data -> description;
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_usergroups.p_insert_group(:title, :description, :new_group ); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
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
            if (!oci_bind_by_name($statement, ":new_group", $cursor, -1, OCI_B_CURSOR)) {
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





    /* Функция редактирования группы пользователей */
    function edit_group ($postdata) {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $groupId = $postdata -> data -> groupId;
        $title = $postdata -> data -> title;
        $description = $postdata -> data -> description;
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_usergroups.p_edit_group(:title, :description, :group_id, :edited_group ); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
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
            if (!oci_bind_by_name($statement, ":group_id", $groupId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":edited_group", $cursor, -1, OCI_B_CURSOR)) {
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





    /* Функция удаления группы */
    function delete_group ($postdata) {
        global $connection;
        $groupId = $postdata -> data -> groupId;
        $moment = 0;

        if (!$statement = oci_parse($connection, "begin pkg_usergroups.p_delete_group(:group_id, :moment); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":group_id", $groupId, -1, OCI_DEFAULT)) {
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
        $position = $postdata -> data -> position;
        $password = $postdata -> data -> password;
        $result = new stdClass;

        if (!$statement = oci_parse($connection, "begin pkg_users.p_insert_user(:group_id, :name, :fname, :surname, :phone, :email, :position, :passwd, :new_user ); end;")) {
            $error = oci_error();
            echo $error["message"];
        } else {
            if (!oci_bind_by_name($statement, ":group_id", $groupId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":name", $name, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":fname", $fname, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":surname", $surname, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":phone", $phone, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":email", $email, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":position", $position, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":passwd", $password, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":new_user", $cursor, -1, OCI_B_CURSOR)) {
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





/* Функция редактирования пользователя */
function edit_user ($postdata) {
    global $connection;
    $cursor = oci_new_cursor($connection);
    $userId = $postdata -> data -> userId;
    $name = $postdata -> data -> name;
    $fname = $postdata -> data -> fname;
    $surname = $postdata -> data -> surname;
    $groupId = $postdata -> data -> groupId;
    $email = $postdata -> data -> email;
    $phone = $postdata -> data -> phone;
    $position = $postdata -> data -> position;
    $result = new stdClass;

    if (!$statement = oci_parse($connection, "begin pkg_users.p_edit_user(:user_id, :group_id, :name, :fname, :surname, :phone, :email, :position, :user ); end;")) {
        $error = oci_error();
        echo $error["message"];
    } else {
        if (!oci_bind_by_name($statement, ":user_id", $userId, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":group_id", $groupId, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":name", $name, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":fname", $fname, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":surname", $surname, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":phone", $phone, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":email", $email, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":position", $position, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":user", $cursor, -1, OCI_B_CURSOR)) {
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





    /* Функция удаления пользователя */
    function delete_user ($postdata) {
        global $connection;
        $userId = $postdata -> data -> userId;
        $moment = 0;

        if (!$statement = oci_parse($connection, "begin pkg_users.p_delete_user(:user_id, :moment); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":user_id", $userId, -1, OCI_DEFAULT)) {
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

        /* Освобождение ресурсов */
        oci_free_statement($statement);

        /* Возврат результата */
        echo json_encode($moment);
    };



/* Функция получения прав пользователя */
function get_user_permissions ($postdata) {
    global $connection;
    $userId = $postdata -> data -> userId;
    $result = array();

    if (!$statement = oci_parse($connection, "begin pkg_users.p_get_user_permissions(:user_id, :permissions); end;")) {
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        $cursor = oci_new_cursor($connection);
        if (!oci_bind_by_name($statement, ":user_id", $userId, -1, OCI_DEFAULT)) {
           $error = oci_error();
           $result = new DBError($error["code"], $error["message"]);
           echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":permissions", $cursor, -1, OCI_B_CURSOR)) {
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
                while ($permission = oci_fetch_assoc($cursor))
                    array_push($result, $permission);
            }
        }
    }

    /* Освобождение ресурсов */
    oci_free_statement($statement);
    oci_free_statement($cursor);

    /* Возврат результата */
    echo json_encode($result);
};




/* Функция добавления правила доступа к данным*/
function set_permission ($postdata) {
    global $connection;
    $cursor = oci_new_cursor($connection);
    $userId = $postdata -> data -> userId;
    $ruleId = $postdata -> data -> ruleId;
    $enabled = $postdata -> data -> enabled;
    $result = new stdClass;

    if (!$statement = oci_parse($connection, "begin pkg_users.p_set_user_permission(:user_id, :rule_id, :enabled, :permission); end;")) {
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!oci_bind_by_name($statement, ":user_id", $userId, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":rule_id", $ruleId, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":enabled", $enabled, -1, OCI_DEFAULT)) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        }
        if (!oci_bind_by_name($statement, ":permission", $cursor, -1, OCI_B_CURSOR)) {
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

    /* Освобождение ресурсов */
    oci_free_statement($statement);
    oci_free_statement($cursor);

    /* Возврат результата */
    echo json_encode($result);
};
?>