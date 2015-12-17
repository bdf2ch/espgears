<?php
    include "../config.php";
    include "../core.php";
    $postdata = json_decode(file_get_contents('php://input'));

    $result = new stdClass;
    $titles = array();
    $titleStatuses = array();
    $buildingPlans = array();
    $buildingStatuses = array();
    $titleContractors = array();
    $powerLines = array();
    $nodeTypes = array();
    $userGroups = array();
    $users = array();
    $permission_rules = array();
    $user_permissions = array();
    $contractorTypes = array();
    $contractors = array();
    $pylonTypes = array();
    $cableTypes = array();
    $anchorTypes = array();

    $requestTypes = array();
    $requestStatuses = array();
    $requests = array();

    $workingCommissions = array();

    /* ����������� � �� */
    $connection = oci_connect($db_user, $db_password, $db_host, 'AL32UTF8');
    if (!$connection){
        oci_close($connection);
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        $cursor = oci_new_cursor($connection);

        /* ��������� ������ ���� ������� */
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
                        array_push($titles, $title);
                }
            }
        }
        $result -> titles = $titles;

        /* ��������� ���� �������� ������ */
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
                    while ($titleStatus = oci_fetch_assoc($cursor))
                        array_push($titleStatuses, $titleStatus);
                }
            }
        }
        $result -> titleStatuses = $titleStatuses;

        /* ��������� ���� ������ ����� ���� ������ ������������� ��� ������� */
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
                        array_push($buildingPlans, $plan);
                }
            }
        }
        $result -> buildingPlans = $buildingPlans;

        /* ��������� ���� �������� ����� ����� ������������� ������ */
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
                        array_push($buildingStatuses, $building_status);
                }
            }
        }
        $result -> buildingStatuses = $buildingStatuses;

        /* ��������� ������ ���� ����������� ���� ������ ������������� ���� ������� */
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
                        array_push($titleContractors, $contractor);
                }
            }
        }
        $result -> titleContractors = $titleContractors;

        /* ��������� ������ ���� ����� */
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
                        array_push($powerLines, $powerline);
                }
            }
        }
        $result -> powerLines = $powerLines;

        /* ��������� ������ ����� ����� */
        if (!$statement = oci_parse($connection, "begin PKG_OBJECT_TYPES.P_GET_OBJECT_TYPES(:node_types); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":node_types", $cursor, -1, OCI_B_CURSOR)) {
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
                        array_push($nodeTypes, $node);
                }
            }
        }
        $result -> nodeTypes = $nodeTypes;

        /* ��������� ������ ���� ����� ������������� */
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
                        array_push($userGroups, $user_group);
                }
            }
        }
        $result -> userGroups = $userGroups;

        /* ��������� ������ ���� ������������� */
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
                        array_push($users, $user);
                }
            }
        }
        $result -> users = $users;


        /* Возвращает список всех правил доступа к данным */
        if (!$statement = oci_parse($connection, "begin pkg_users.p_get_permission_rules(:permission_rules); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":permission_rules", $cursor, -1, OCI_B_CURSOR)) {
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
                    while ($permission_rule = oci_fetch_assoc($cursor))
                        array_push($permission_rules, $permission_rule);
                    }
                }
        }
        $result -> permissionRules = $permission_rules;


        /* Возвращает список всех разрешений доступа к данным для пользователя */
        if (!$statement = oci_parse($connection, "begin pkg_users.p_get_user_permissions(:user_id, :permissions); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":user_id", $postdata -> data -> userId, -1, OCI_DEFAULT)) {
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
                        array_push($user_permissions, $permission);
                }
            }
        }
        $result -> userPermissions = $user_permissions;

        /* ��������� ������ ���� ����� ������������ */
        if (!$statement = oci_parse($connection, "begin pkg_contractor_types.p_get_contractor_types(:contractor_types); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":contractor_types", $cursor, -1, OCI_B_CURSOR)) {
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
                    while ($contractor_type = oci_fetch_assoc($cursor))
                        array_push($contractorTypes, $contractor_type);
                }
            }
        }
        $result -> contractorTypes = $contractorTypes;

        /* ��������� ������ ���� ������������ */
        if (!$statement = oci_parse($connection, "begin pkg_contractors.p_get_contractors(:contractors); end;")) {
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
                        array_push($contractors, $contractor);
                }
            }
        }
        $result -> contractors = $contractors;

        /* ��������� ������ ���� ����� ���� */
        if (!$statement = oci_parse($connection, "begin PKG_PYLON_TYPES.P_GET_PYLON_TYPES(:pylon_types); end;")) {
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
                        array_push($pylonTypes, $pylon_type);
                }
            }
        }
        $result -> pylonTypes = $pylonTypes;


        /* ��������� ������ ����� ������ */
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
                        array_push($cableTypes, $cable_type);
                }
            }
        }
        $result -> cableTypes = $cableTypes;

        /* ��������� ������ ����� ��������� */
        if (!$statement = oci_parse($connection, "begin PKG_ANCHOR_TYPES.P_GET_ANCHOR_TYPES(:anchor_types); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":anchor_types", $cursor, -1, OCI_B_CURSOR)) {
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
                    while ($anchor_type = oci_fetch_assoc($cursor))
                        array_push($anchorTypes, $anchor_type);
                }
            }
        }
        $result -> anchorTypes = $anchorTypes;

        /* ��������� ������ ���� ����� ������ */
        if (!$statement = oci_parse($connection, "begin pkg_titules.p_get_request_types(:data); end;")) {
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
                    while ($requestType = oci_fetch_assoc($cursor))
                        array_push($requestTypes, $requestType);
                }
            }
        }
        $result -> requestTypes = $requestTypes;



        /* ��������� ������ ���� ������ */
        if (!$statement = oci_parse($connection, "begin pkg_titules.p_get_request_statuses(:data); end;")) {
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
                    while ($requestStatus = oci_fetch_assoc($cursor))
                        array_push($requestStatuses, $requestStatus);
                }
            }
        }
        $result -> requestStatuses = $requestStatuses;


        /* ��������� ������ ���� ������ */
        if (!$statement = oci_parse($connection, "begin pkg_titules.p_get_requests(:data); end;")) {
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
                    while ($request = oci_fetch_assoc($cursor)) {
                        $cursor2 = oci_new_cursor($connection);
                        if (!$statement2 = oci_parse($connection, "begin pkg_titules.p_get_tu_doc(:r_id, :tu); end;")) {
                            $error = oci_error();
                            $result = new DBError($error["code"], $error["message"]);
                            echo(json_encode($result));
                        } else {
                            if (!oci_bind_by_name($statement2, ":r_id", $request["ID"], -1, OCI_DEFAULT)) {
                                $error = oci_error();
                                $result = new DBError($error["code"], $error["message"]);
                                echo(json_encode($result));
                            }
                            if (!oci_bind_by_name($statement2, ":tu", $cursor2, -1, OCI_B_CURSOR)) {
                                $error = oci_error();
                                $result = new DBError($error["code"], $error["message"]);
                                echo(json_encode($result));
                            }
                            if (!oci_execute($statement2)) {
                                $error = oci_error();
                                $result = new DBError($error["code"], $error["message"]);
                                echo(json_encode($result));
                            } else {
                                if (!oci_execute($cursor2)) {
                                    $error = oci_error();
                                    $result = new DBError($error["code"], $error["message"]);
                                    echo(json_encode($result));
                                } else {
                                    while ($tu = oci_fetch_assoc($cursor2))
                                        $request["tu"] = $tu;
                                }
                            }

                        }
                        oci_free_statement($statement2);
                        oci_free_statement($cursor2);

                        array_push($requests, $request);
                    }
                }
            }
        }
        $result -> requests = $requests;


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
                        array_push($workingCommissions, $commission);
                }
            }
        }
        $result -> workingCommissions = $workingCommissions;



        /* ������������ �������� */
        oci_free_statement($statement);
        oci_free_statement($cursor);

        /* ������� ���������� */
        echo json_encode($result);
        //echo $result;
    }

?>