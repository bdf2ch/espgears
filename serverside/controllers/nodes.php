<?php
    //if (!$_COOKIE["user"])
    //            die("���������������� ������!");
    //else {
        include "../config.php";
        $postdata = json_decode(file_get_contents('php://input'));

        $action = $postdata -> action;
        $result = array();

        /* ����������� � �� */
        $connection = oci_connect($db_user, $db_password, $db_host, 'AL32UTF8');
        if (!$connection){
            oci_close($connection);
            print_r(oci_error());
            die('�� ������� ������������ � ��');
        } else {
            switch ($action) {
                /* ��������� ���� ����� ����� ��������� ������ */
                //case "getNodesByTituleId":
                //    get_nodes_by_titule_id($postdata);
                //    break;

                /* ���������� ��� ���� ����� */
                case "getNodeTypes":
                    get_node_types();
                    break;


                case "getPylonsByPowerLineId":
                    get_pylons_by_power_line_id ($postdata);
                    break;

                /* ��������� �������� ����� �� id ���� */
                //case "getChildNodes":
                //    get_child_nodes($postdata);
                //    break;

                /* �������� ����, ��������� � ������ �����, ��������� �� ��������� ���� */
                case "getBranches":
                    get_branches($postdata);
                    break;

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

        // ������������ ��������
        oci_free_statement($statement);
        oci_free_statement($cursor);

        // ������� ����������
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

        // ������������ ��������
        oci_free_statement($statement);
        oci_free_statement($cursor);

        // ������� ����������
        echo json_encode($result);
    };


    /* �������� ����, ��������� � ������ �����, ��������� �� ��������� ���� */
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

        // ������������ ��������
        oci_free_statement($statement);
        oci_free_statement($cursor);

        // ������� ����������
        echo json_encode($result);
    };

?>