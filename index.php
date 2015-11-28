<?php
    include("libs/xtemplate/xtemplate.class.php");
    include("serverside/config.php");

    /* Соединение с БД */
    $connection = oci_connect($db_user, $db_password, $db_host, 'AL32UTF8');
    if (!$connection) {
        oci_close($connection);
        die('Не удалось подключиться к БД');
    } else {
        $versions = array();
        $cursor = oci_new_cursor($connection);
        $statement = oci_parse($connection, "begin pkg_versions.p_get_versions(:data); end;");
        oci_bind_by_name($statement, ":data", $cursor, -1, OCI_B_CURSOR);
        oci_execute($statement);
        oci_execute($cursor);

        while ($data = oci_fetch_assoc($cursor))
            array_push($versions, $data);
         setcookie("vcs_versions", json_encode($versions));

        oci_free_statement($statement);
        oci_free_statement($cursor);
        oci_close($connection);
    }

    //setcookie("_appUser_", "dasdasdasd");

    if (isset($_COOKIE["espreso_session_id"]))
        $template = new XTemplate("templates/application.html");
    else
        $template = new XTemplate("templates/authorization.html");

    $template -> parse("main");
    $template -> out("main");
?>