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
                /* ���������� ��� ���� ������ */
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

    // ������������ ��������
    oci_free_statement($statement);
    oci_free_statement($cursor);

    // ������� ����������
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

        // ������������ ��������
        oci_free_statement($statement);
        oci_free_statement($cursor);

        // ������� ����������
        echo json_encode($result);
};

?>