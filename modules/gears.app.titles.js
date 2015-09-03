"use strict";


var titles = angular.module("gears.app.titles",[])
    .config(function ($provide) {

        /**
         * $titles
         * Сервис, одержащий функционал для работы с титулами
         */
        $provide.factory("$titles", ["$log", "$http", "$factory", function ($log, $http, $factory) {
            var titles = {};


            /**
             * Наборы свойст и методов, описывающих модели данных
             */
            titles.classes = {
                /**
                 * Title
                 * Набор свойств, описывающих титул
                 */
                Title: {
                    id: new Field({ source: "ID", value: 0, default_value: 0 }),
                    title: new Field({ source: "TITUL_NAME", value: "", default_value: "", backupable: true, required: true }),
                    statusId: new Field({ source: "STATUS_ID", value: 0, default_value: 0, backupable: true }),
                    startPointId: new Field({ source: "START_POINT_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    startNodeTypeId: new Field({ source: "START_OBJECT_TYPE_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    startNodeId: new Field({ source: "START_OBJECT_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    endPointId: new Field({ source: "END_POINT_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    endNodeTypeId: new Field({ source: "END_OBJECT_TYPE_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    endNodeId: new Field({ source: "END_OBJECT_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    description: new Field({ source: "NAME_EXTRA", value: "", default_value: "", backupable: true }),
                    length: new Field({ source: "LENGTH", value: 0, default_value: 0, backupable: true })
                 },

                /**
                 * TitlePart
                 * Набор свойст, описывающих участок титула
                 */
                TitlePart: {
                    id: new Field({ source: "ID", value: 0, default_value: 0 }),
                    tituleId: new Field({ source: "TITUL_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    title: new Field({ source: "TITLE", value: "", default_value: "", backupable: true, required: true }),
                    startPointId: new Field({ source: "START_POINT_ID", value: 0, default_value: 0, backupable: true }),
                    startObjectTypeId: new Field({ source: "START_OBJECT_TYPE_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    startObjectId: new Field({ source: "START_OBJECT_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    endPointId: new Field({ source: "END_POINT_ID", value: 0, default_value: 0, backupable: true }),
                    endObjectTypeId: new Field({ source: "END_OBJECT_TYPE_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    endObjectId: new Field({ source: "END_OBJECT_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    cableTypeId: new Field({ source: "CABLE_TYPE_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    length: new Field({ source: "LENGTH", value: 0, default_value: 0, backupable: true })
                },

                /**
                 * TitleStatus
                 * Набор свойств, описывающих статус титула
                 */
                TitleStatus: {
                    id: new Field({ source: "ID", value: 0, default_value: 0 }),
                    title: new Field({ source: "TITLE", value: "", default_value: "", backupable: true, required: true })
                },

                /**
                 * TitleNodes
                 * Набор свойст и методов, описывающих иерархию узлов, входящих в титул
                 */
                TitleNodes: {
                    nodes: [],
                    root: [],

                    appendNode: function (parameters) {
                        if (parameters !== undefined) {
                            if (parameters["node"] !== undefined) {
                                var node = parameters["node"];
                                if (parameters["nodeId"] !== undefined && parameters["branchId"] !== undefined) {
                                    var length = this.nodes.length;
                                    for (var i = 0; i < length; i++) {
                                        if (this.nodes[i].id.value === parameters["nodeId"]) {

                                        }
                                    }
                                } else {
                                    node.haveBranches = false;
                                    node.isExpanded = false;
                                    node.branches = [];
                                    node.parentId = -1;
                                    node.prevNodeId = this.root.length > 0 ? this.root[this.root.length - 1].id.value : -1;
                                    node.nextNodeId = -1;
                                    this.root.push(node);
                                    this.nodes.push(node);
                                    return true;
                                }
                            } else {
                                $log.error("TitleNodes: Не задан узел, который требуется добавить");
                                return false;
                            }
                        } else {
                            $log.error("TitleNodes: Не заданы параметры при добавлении узла");
                            return false;
                        }
                    }

                }


            };


            /**
             * Переменные сервиса
             */
            titles.titles = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            titles.parts = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            titles.statuses = $factory({ classes: ["Collection", "States"], base_class: "Collection" });


            /**
             * Получает список всех титулов и помещает их в коллекцию
             */
            titles.getTitles = function () {
                titles.titles._states_.loaded(false);
                $http.post("serverside/controllers/titles.php", {action: "getTitles"})
                    .success(function (data) {
                        if (data !== undefined) {
                            angular.forEach(data, function (title_data, key) {
                                var temp_title = $factory({ classes: ["Model", "Title", "Backup", "States"], base_class: "Title" });
                                temp_title._model_.fromJSON(title_data);
                                titles.titles.append(temp_title);
                                temp_title._backup_.setup();
                            });
                            titles.titles._states_.loaded(true);
                        }
                        $log.log(titles.titles);
                    }
                );
            };


            /**
             * Получает список частей титулов всех титулов
             */
            titles.getParts = function () {
                $http.post("serverside/controllers/titles.php", {action: "getParts"})
                    .success(function (data) {
                        if (data !== undefined) {
                            angular.forEach(data, function (title_part) {
                                var part = $factory.make({ classes: ["TitlePart", "Model", "Backup", "States"], base_class: "TitlePart" });
                                part._model_.fromJSON(title_part);
                                part._backup_.setup();
                                titles.parts.append(part);
                            });
                        }
                    }
                );
            };


            /**
             * Получает список статусов титула
             */
            titles.getStatuses = function () {
                titles.statuses._states_.loaded(false);
                $http.post("serverside/controllers/titles.php", { action: "getStatuses" })
                    .success(function (data) {
                        if (data !== undefined) {
                            if (data["error_code"] !== undefined) {
                                var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                db_error.init(data);
                                db_error.display();
                            } else {
                                angular.forEach(data, function (status) {
                                    var temp_status = $factory({ classes: ["TitleStatus", "Model", "Backup", "States"], base_class: "TitleStatus" });
                                    temp_status._model_.fromJSON(status);
                                    temp_status._backup_.setup();
                                    titles.statuses.append(temp_status);
                                });
                            }
                        }
                        titles.statuses._states_.loaded(true);
                        $log.log("statuses = ", titles.statuses.items);
                    }
                );
            };


            /**
             * Отправляет данные нового титула на сервер и добавляет его в коллекцию
             * @param title
             */
            titles.addTitle = function (title, callback) {
                if (title !== undefined) {
                    var params = {
                        action: "addTitle",
                        data: {
                            startNodeTypeId: title.startNodeTypeId.value,
                            endNodeTypeId: title.endNodeTypeId.value,
                            startPointId: 0,
                            endPointId: 0,
                            startNodeId: title.startNodeId.value,
                            endNodeId: title.endNodeId.value,
                            title: title.title.value,
                            description: title.description.value
                        }
                    };
                    $http.post("serverside/controllers/titles.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                if (data["error_code"] !== undefined) {
                                    var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                    db_error.init(data);
                                    db_error.display();
                                } else {
                                    var temp_title = $factory({ classes: ["Title", "Model", "Backup", "States"], base_class: "Title" });
                                    temp_title._model_.fromJSON(data);
                                    temp_title._backup_.setup();
                                    titles.titles.append(temp_title);
                                    if (callback !== undefined)
                                        callback(temp_title);
                                }
                            }
                        }
                    );
                }
            };


            titles.editTitle = function (title, callback) {
                if (title !== undefined) {
                    var params = {
                        action: "editTitle",
                        data: {
                            id: title.id.value,
                            startNodeTypeId: title.startNodeTypeId.value,
                            endNodeTypeId: title.endNodeTypeId.value,
                            startPointId: 0,
                            endPointId: 0,
                            startNodeId: title.startNodeId.value,
                            endNodeId: title.endNodeId.value,
                            title: title.title.value,
                            description: title.description.value
                        }
                    };
                    $http.post("serverside/controllers/titles.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                if (data["error_code"] !== undefined) {
                                    var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                    db_error.init(data);
                                    db_error.display();
                                } else {
                                    if (callback !== undefined)
                                        callback(data);
                                }
                            }
                        }
                    );
                }
            };


            /**
             * Возвращает начальный и конечный узлы титула
             * @param titleId {Number} - Идентификатор титула
             */
            titles.getBoundaryNodes = function (titleId, callback) {
                if (titleId !== undefined) {
                    var params = {
                        action: "getBoundaryNodes",
                        data: {
                            id: titleId
                        }
                    };
                    $http.post("serverside/controllers/titles.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                if (data["error_code"] !== undefined) {
                                    var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                    db_error.init(data);
                                    db_error.display();
                                } else {
                                    if (callback !== undefined)
                                        callback(data);
                                }
                            }
                        }
                    );
                }
            };


            titles.getTitleNodes = function (titleId, titlePartId, nodeId, branchId, callback) {
                if (titleId !== undefined) {
                    var params = {
                        action: "getTitleNodes",
                        data: {
                            titleId: titleId,
                            titlePartId: titlePartId,
                            nodeId: nodeId,
                            branchId: branchId,
                            sessionId: "test"
                        }
                    };
                    $http.post("serverside/controllers/titles.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                if (data["error_code"] !== undefined) {
                                    var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                    db_error.init(data);
                                    db_error.display();
                                } else {
                                    if (callback !== undefined)
                                        callback(data);
                                }
                            }
                        }
                    );
                }
            };


            return titles;
        }]);
    })
    .run(function ($modules, $titles, $log) {
        $modules.load($titles);
        $titles.getTitles();
        $titles.getStatuses();
        //$log.log($titules.titules);
        //$titules.titules.display();
    });