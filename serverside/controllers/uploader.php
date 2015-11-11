<?php

include "../config.php";
include "../core.php";


if (isset($_FILES["file"]["tmp_name"]) && isset($_POST["requestId"])) {
    $result = new stdClass;
    $result -> title = $_FILES["file"]["name"];
    $result -> type = $_FILES["file"]["type"];
    $result -> size = $_FILES["file"]["size"];
    $requestId = $_POST["requestId"];
    $statusId = $_POST["statusId"];

    switch ($_POST["doc_type"]) {
        case "tu":
            upload_tu();
            break;
        case "gs":
            upload_gs();
            break;
        case "doud":
            upload_doud();
            break;
        case "rsd":
            upload_rsd();
            break;
    }
}



function upload_tu () {
    global $db_user;
    global $db_password;
    global $db_host;
    global $requestId;
    global $result;

    $connection = oci_connect($db_user, $db_password, $db_host, 'AL32UTF8');
    if (!$connection) {
        oci_close($connection);
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!$statement = oci_parse($connection, "begin pkg_titules.p_add_tu_doc(:r_id, :r_file_title, :r_file_size, :r_file_type, :r_file_content); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            $blob = oci_new_descriptor($connection, OCI_D_LOB);
            if (!oci_bind_by_name($statement, ":r_id", $requestId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":r_file_title", $result -> title, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":r_file_size", $result -> size, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":r_file_type", $result -> type, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":r_file_content", $blob, -1, OCI_B_BLOB)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_execute($statement, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            } else {
                if (!$blob -> savefile($_FILES["file"]["tmp_name"])) {
                    oci_rollback($connection);
                    echo("file upload error");
                    print_r(oci_error());
                } else {
                    oci_commit($connection);
                }
            }

            // Освобождение ресурсов
            $blob -> free();
            oci_free_statement($statement);
        }
        oci_close($connection);
        echo(json_encode($result));
    }
};



function upload_gs () {
    global $db_user;
    global $db_password;
    global $db_host;
    global $requestId;
    global $result;

    $connection = oci_connect($db_user, $db_password, $db_host, 'AL32UTF8');
    if (!$connection) {
        oci_close($connection);
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!$statement = oci_parse($connection, "begin pkg_titules.p_add_gen_sogl_doc(:r_id, :r_file_title, :r_file_size, :r_file_type, :r_file_content); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            $blob = oci_new_descriptor($connection, OCI_D_LOB);
            if (!oci_bind_by_name($statement, ":r_id", $requestId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":r_file_title", $result -> title, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":r_file_size", $result -> size, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":r_file_type", $result -> type, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":r_file_content", $blob, -1, OCI_B_BLOB)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_execute($statement, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            } else {
                if (!$blob -> savefile($_FILES["file"]["tmp_name"])) {
                    oci_rollback($connection);
                    echo("file upload error");
                    print_r(oci_error());
                } else {
                    oci_commit($connection);
                }
            }

            // Освобождение ресурсов
            $blob -> free();
            oci_free_statement($statement);
        }
        oci_close($connection);
        echo(json_encode($result));
    }
};




function upload_doud () {
      global $db_user;
      global $db_password;
      global $db_host;
      global $requestId;
      global $result;

      $connection = oci_connect($db_user, $db_password, $db_host, 'AL32UTF8');
      if (!$connection) {
          oci_close($connection);
          $error = oci_error();
          $result = new DBError($error["code"], $error["message"]);
          echo(json_encode($result));
      } else {
          if (!$statement = oci_parse($connection, "begin pkg_titules.p_add_doud_doc(:r_id, :r_file_title, :r_file_size, :r_file_type, :r_file_content); end;")) {
              $error = oci_error();
              $result = new DBError($error["code"], $error["message"]);
              echo(json_encode($result));
          } else {
              $blob = oci_new_descriptor($connection, OCI_D_LOB);
              if (!oci_bind_by_name($statement, ":r_id", $requestId, -1, OCI_DEFAULT)) {
                  $error = oci_error();
                  $result = new DBError($error["code"], $error["message"]);
                  echo(json_encode($result));
              }
              if (!oci_bind_by_name($statement, ":r_file_title", $result -> title, -1, OCI_DEFAULT)) {
                  $error = oci_error();
                  $result = new DBError($error["code"], $error["message"]);
                  echo(json_encode($result));
              }
              if (!oci_bind_by_name($statement, ":r_file_size", $result -> size, -1, OCI_DEFAULT)) {
                  $error = oci_error();
                  $result = new DBError($error["code"], $error["message"]);
                  echo(json_encode($result));
              }
              if (!oci_bind_by_name($statement, ":r_file_type", $result -> type, -1, OCI_DEFAULT)) {
                  $error = oci_error();
                  $result = new DBError($error["code"], $error["message"]);
                  echo(json_encode($result));
              }
              if (!oci_bind_by_name($statement, ":r_file_content", $blob, -1, OCI_B_BLOB)) {
                  $error = oci_error();
                  $result = new DBError($error["code"], $error["message"]);
                  echo(json_encode($result));
              }
              if (!oci_execute($statement, OCI_DEFAULT)) {
                  $error = oci_error();
                  $result = new DBError($error["code"], $error["message"]);
                  echo(json_encode($result));
              } else {
                  if (!$blob -> savefile($_FILES["file"]["tmp_name"])) {
                      oci_rollback($connection);
                      echo("file upload error");
                      print_r(oci_error());
                  } else {
                      oci_commit($connection);
                  }
              }

              // Освобождение ресурсов
              $blob -> free();
              oci_free_statement($statement);
          }
          oci_close($connection);
          echo(json_encode($result));
      }
};




function upload_rsd () {
    global $db_user;
    global $db_password;
    global $db_host;
    global $requestId;
    global $statusId;
    global $result;

    $connection = oci_connect($db_user, $db_password, $db_host, 'AL32UTF8');
    if (!$connection) {
        oci_close($connection);
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        if (!$statement = oci_parse($connection, "begin pkg_titules.p_add_request_status_doc(:r_id, :r_status_id, :r_file_title, :r_file_size, :r_file_type, :r_file_content, :rsd); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            $blob = oci_new_descriptor($connection, OCI_D_LOB);
            $cursor = oci_new_cursor($connection);

            if (!oci_bind_by_name($statement, ":r_id", $requestId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":r_status_id", $statusId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":r_file_title", $result -> title, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":r_file_size", $result -> size, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":r_file_type", $result -> type, -1, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":r_file_content", $blob, -1, OCI_B_BLOB)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_bind_by_name($statement, ":rsd", $cursor, -1, OCI_B_CURSOR)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_execute($statement, OCI_DEFAULT)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            } else {
                if (!$blob -> savefile($_FILES["file"]["tmp_name"])) {
                    oci_rollback($connection);
                    echo("file upload error");
                    print_r(oci_error());
                } else {
                    oci_commit($connection);
                    if (!oci_execute($cursor)) {
                        $error = oci_error();
                        $result = new DBError($error["code"], $error["message"]);
                        echo(json_encode($result));
                    } else {
                        $rsd = oci_fetch_assoc($cursor);
                        echo(json_encode($rsd));
                    }
                }
            }

            // Освобождение ресурсов
            $blob -> free();
            oci_free_statement($statement);
        }
        oci_close($connection);
        //echo(json_encode($result));
    }
};



?>