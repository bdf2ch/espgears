"use strict";


var titles = angular.module("gears.app.titles",[])
    .config(function ($provide) {

        /**
         * $titles
         * Сервис, одержащий функционал для работы с титулами
         */
        $provide.factory("$titles", ["$log", "$http", "$factory", "$session", function ($log, $http, $factory, $session) {
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
                    requestId: new Field({ source: "REQUEST_ID", value: 0, default_value: 0, backupable: true }),
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
                    titleId: new Field({ source: "TITUL_ID", value: 0, default_value: 0, backupable: true, required: true }),
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
                 * TitleBuildingPlanItem
                 * Набор свойст, описывающих этап строительства титула
                 */
                TitleBuildingPlanItem: {
                    id: new Field({ source: "ID", value: 0, default_value: 0 }),
                    titleId: new Field({ source: "TITLE_ID", value: 0, default_value: 0 }),
                    statusId: new Field({ source: "STATUS_ID", value: 3, default_value: 3, backupable: true }),
                    title: new Field({ source: "TITLE", value: "", default_value: "", backupable: true, required: true }),
                    description: new Field({ source: "DESCRIPTION", value: "", default_value: "", backupable: true }),
                    start: new Field({ source: "START_PERIOD", value: 0, default_value: 0, backupable: true, required: true }),
                    end: new Field({ source: "END_PERIOD", value: 0, default_value: 0, backupable: true, required: true })
                },

                /**
                 * BuildingStatus
                 * Набор свойств, описывающих статус этапа строительства титула
                 */
                BuildingStatus: {
                    id: new Field({ source: "ID", value: 0, default_value: 0 }),
                    title: new Field({ source: "TITLE", value: "", default_value: "", backupable: true, required: true })
                },


                TitleContractor: {
                    titleId: new Field({ source: "TITLE_ID", value: 0, default_value: 0 }),
                    contractorId: new Field({ source: "CONTRACTOR_ID", value: 0, default_value: 0 })
                },

                FileItem_: {
                    id: new Field({ source: "ID", value: 0, default_value: 0 }),
                    title: new Field({ source: "FILE_TITLE", value: "", default_value: "", backupable: true }),
                    size: new Field({ source: "FILE_SIZE", value: 0, default_value: 0 }),
                    type: new Field({ source: "FILE_TYPE", value: "", default_value: "" })
                },

                /**
                 * WorkingCommission
                 * Набор свойств, описывающих рабочую коммиссию
                 */
                WorkingCommission: {
                    id: new Field({ source: "ID", value: 0, default_value: 0 }),
                    titleId: new Field({ source: "TITLE_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    date: new Field({ source: "TIMESTAMP", value: 0, default_value: 0, backupable: true, required: true }),
                    remarks: []
                },

                /**
                 * TitleNodes
                 * Набор свойст и методов, описывающих иерархию узлов, входящих в титул
                 */
                TitleNodes: {
                    nodes: [],
                    root: [],
                    titleId: 0,

                    clear: function () {
                        this.root.splice(0, this.root.length);
                        this.nodes.splice(0, this.nodes.length);
                    },

                    appendNode: function (parameters) {
                        if (parameters !== undefined) {
                            if (parameters["node"] !== undefined) {
                                var node = parameters["node"];
                                if (parameters["nodeId"] !== undefined && parameters["branchId"] !== undefined) {
                                    $log.log("appending to branch ", parameters["branchId"]);
                                    var length = this.nodes.length;
                                    for (var i = 0; i < length; i++) {
                                        if (this.nodes[i].id.value === parameters["nodeId"]) {
                                            if (this.nodes[i].branches.length > 0) {
                                                var branches_count = this.nodes[i].branches.length;
                                                var found = false;
                                                for (var x = 0; x < branches_count; x++) {
                                                    if (this.nodes[i].branches[x].id === parameters["branchId"]) {
                                                        $log.log("branch #" + parameters["branchId"] + " found");
                                                        found = true;
                                                        node.isExpanded = false;
                                                        node.branches = [];
                                                        node.parentId = parameters["nodeId"];
                                                        node.prevNodeId = this.nodes[i].branches[x].length > 0 ? this.nodes[i].branches[x][this.nodes[i].branches[x].length - 1].id.value : -1;
                                                        if (this.nodes[i].branches[x][this.nodes[i].branches[x].length - 1] !== undefined)
                                                            this.nodes[i].branches[x][this.nodes[i].branches[x].length - 1].nextNodeId = node.id.value;
                                                        node.nextNodeId = -1;
                                                        this.nodes.push(node);
                                                        this.nodes[i].branches[x].push(node);
                                                        this.nodes[i].isExpanded = true;
                                                        return true;
                                                    }
                                                }
                                                if (found == false) {
                                                    $log.log("branch #" + parameters["branchId"] + " not found");
                                                    var new_branch = [];
                                                    new_branch.id = parameters["branchId"];
                                                    node.isExpanded = false;
                                                    node.branches = [];
                                                    node.parentId = parameters["nodeId"];
                                                    node.prevNodeId = -1;
                                                    node.nextNodeId = -1;
                                                    new_branch.push(node);
                                                    this.nodes.push(node);
                                                    this.nodes[i].branches.push(new_branch);
                                                    this.nodes[i].isExpanded = true;
                                                    return true;
                                                }

                                            } else {
                                                $log.log("branch #" + parameters["branchId"] + " not found");
                                                var new_branch = [];
                                                new_branch.id = parameters["branchId"];
                                                node.isExpanded = false;
                                                node.branches = [];
                                                node.parentId = parameters["nodeId"];
                                                node.prevNodeId = -1;
                                                node.nextNodeId = -1;
                                                new_branch.push(node);
                                                this.nodes.push(node);
                                                this.nodes[i].branches.push(new_branch);
                                                this.nodes[i].isExpanded = true;
                                                return true;
                                            }
                                            //this.nodes[i].isExpanded = true;
                                        }
                                    }
                                } else {
                                    node.isExpanded = false;
                                    node.branches = [];
                                    node.parentId = -1;
                                    node.prevNodeId = this.root.length > 0 ? this.root[this.root.length - 1].id.value : -1;
                                    if (this.root[this.root.length - 1] !== undefined)
                                        this.root[this.root.length - 1].nextNodeId = node.id.value;
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
                    },

                    getBranches: function (parameters) {
                        if (parameters !== undefined) {
                            if (parameters["nodeId"] !== undefined) {
                                var nodeId = parameters["nodeId"];
                                var length = this.nodes.length;
                                for (var i = 0; i < length; i++) {
                                    if (this.nodes[i].id.value === nodeId) {
                                        if (parameters["parentId"] !== undefined) {
                                            if (this.nodes[i].parentId === parameters["parentId"]) {
                                                return this.nodes[i].branches;
                                            }
                                        } else
                                            return this.nodes[i].branches;
                                    }
                                }
                            }
                        } else {
                            $log.error("TitleNodes: Не заданы параметры при получении ветвей узла");
                            return false;
                        }
                    },


                    select: function (parameters) {
                        if (parameters !== undefined) {
                            if (parameters["nodeId"] !== undefined && parameters["parentId"] !== undefined) {
                                var length = this.nodes.length;
                                for (var i = 0; i < length; i++) {
                                    if (this.nodes[i].id.value === parameters["nodeId"]) {
                                        if (this.nodes[i].parentId === parameters["parentId"]) {
                                            if (this.nodes[i]._states_.selected() === false) {
                                                this.nodes[i]._states_.selected(true)
                                                if (parameters["callback"] !== undefined)
                                                    parameters.callback(this.nodes[i]);
                                                //$application.currentNode = this.nodes[i];
                                            } else {
                                                this.nodes[i]._states_.selected(false);
                                                if (parameters["callback"] !== undefined)
                                                    parameters.callback(undefined);
                                                //$application.currentNode = undefined;
                                            }
                                        }
                                    } else {
                                        if (this.nodes[i]._states_.selected() === true)
                                            this.nodes[i]._states_.selected(false);
                                    }
                                }
                                //if ($application.currentNode !== undefined) {
                                //    $log.log("node id = " + $application.currentNode.id.value + ", prev node id = " + $application.currentNode.prevNodeId + ", next node id = " + $application.currentNode.nextNodeId);
                                //    $log.log("selected node = ", $application.currentNode);
                                //}
                            } else {
                                $log.error("TitleNodes: Не задан идентификатор выбираемого узла");
                                return false;
                            }
                        } else {
                            $log.error("TitleNodes: Не заданы параметры при выборе узла");
                            return false;
                        }
                    },

                    expand: function (parameters) {
                        if (parameters !== undefined) {
                            if (parameters["nodeId"] !== undefined) {
                                var length = this.nodes.length;
                                for (var i = 0; i < length; i++) {
                                    if (this.nodes[i].id.value === parameters["nodeId"]) {
                                        if (parameters["parentId"] !== undefined) {
                                            if (this.nodes[i].parentId === parameters["parentId"]) {
                                                this.nodes[i].isExpanded = true;
                                                return true;
                                            }
                                        } else {
                                            this.nodes[i].isExpanded = true;
                                            return true;
                                        }
                                    }
                                }
                            }
                        } else {
                            $log.error("TitleNodes: Не заданы параметры при разворачивании узла");
                            return false;
                        }
                    },


                    collapse: function (parameters) {
                        if (parameters !== undefined) {
                            if (parameters["nodeId"] !== undefined) {
                                var length = this.nodes.length;
                                for (var i = 0; i < length; i++) {
                                    if (this.nodes[i].id.value === parameters["nodeId"]) {
                                        if (parameters["parentId"] !== undefined && parameters["parentId"] !== -1) {
                                            if (this.nodes[i].parentId === parameters["parentId"]) {
                                                this.nodes[i].isExpanded = false;
                                                return true;
                                            }
                                        } else {
                                            this.nodes[i].isExpanded = false;
                                            return true;
                                        }
                                    }
                                }
                            }
                        }  else {
                            $log.error("TitleNodes: Не заданы параметры при сворачивании узла");
                            return false;
                        }
                    }

                }


            };


            /**
             * Переменные сервиса
             */
            titles.requestTypes = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            titles.requestStatuses = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            titles.requests = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            titles.titles = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            titles.parts = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            titles.statuses = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            titles.plans = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            titles.buildingStatuses = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            titles.contractors = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            titles.workingCommissions = $factory({ classes: ["Collection", "States"], base_class: "Collection" });





            /**
             * Получает список всех титулов
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
             * Получает список всех этапов всех планов строительства всех титулов
             */
            titles.getBuildingPlans = function () {
                titles.plans._states_.loaded(false);
                $http.post("serverside/controllers/titles.php", { action: "getBuildingPlans" })
                    .success(function (data) {
                        if (data !== undefined) {
                            if (data["error_code"] !== undefined) {
                                var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                db_error.init(data);
                                db_error.display();
                            } else {
                                angular.forEach(data, function (plan) {
                                    var temp_plan = $factory({ classes: ["TitleBuildingPlanItem", "Model", "Backup", "States"], base_class: "TitleBuildingPlanItem" });
                                    temp_plan._model_.fromJSON(plan);
                                    temp_plan._backup_.setup();
                                    titles.plans.append(temp_plan);
                                });
                            }
                        }
                        titles.plans._states_.loaded(true);
                        $log.log("building plans = ", titles.plans.items);
                    }
                );
            };


            /**
             * Добавляет этап работ плана строительства титула
             * @param plan {TitleBuildingPlanItem} - Этап плана строительства работ титула
             * @param callback - Коллбэк
             */
            titles.addBuildingPlan = function (plan, callback) {
                if (plan !== undefined) {
                    var params = {
                        action: "addBuildingPlan",
                        data: {
                            titleId: plan.titleId.value,
                            statusId: plan.statusId.value,
                            title: plan.title.value,
                            description: plan.description.value,
                            start: plan.start.value,
                            end: plan.end.value
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
                                    var temp_plan = $factory({ classes: ["TitleBuildingPlanItem", "Model", "Backup", "States"], base_class: "TitleBuildingPlanItem" });
                                    temp_plan._model_.fromJSON(data);
                                    temp_plan._backup_.setup();
                                    titles.plans.append(temp_plan);
                                    if (callback !== undefined)
                                        callback(temp_plan);
                                }
                            }
                        }
                    );
                }
            };


            /**
             * Изменяет этап работ плана строительства титула
             * @param plan {TitleBuildingPlanItem} - Этап плана строительства работ титула
             * @param callback - Коллбэк
             */
            titles.editBuildingPlan = function (plan, callback) {
                if (plan !== undefined) {
                    var params = {
                        action: "editBuildingPlan",
                        data: {
                            planId: plan.id.value,
                            statusId: plan.statusId.value,
                            title: plan.title.value,
                            description: plan.description.value,
                            start: plan.start.value,
                            end: plan.end.value
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
                                    plan._backup_.setup();
                                    if (callback !== undefined)
                                        callback(data);
                                }
                            }
                        }
                    );
                }
            };


            /**
             * Удаляет этап работ плана строительства титула
             * @param planId {Number} - Идентификатор этапа работ
             * callback - Коллбэк
             */
            titles.deleteBuildingPlan = function (planId, callback) {
                if (planId !== undefined) {
                    var params = {
                        action: "deleteBuildingPlan",
                        data: {
                            planId: planId
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
                                    titles.plans.delete("id", planId);
                                    if (callback !== undefined)
                                        callback();
                                }
                            }
                        }
                    );
                }
            };


            /**
             * Получает список всех этапов всех планов строительства всех титулов
             */
            titles.getBuildingStatuses = function () {
                titles.buildingStatuses._states_.loaded(false);
                $http.post("serverside/controllers/titles.php", { action: "getBuildingStatuses" })
                    .success(function (data) {
                        if (data !== undefined) {
                            if (data["error_code"] !== undefined) {
                                var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                db_error.init(data);
                                db_error.display();
                            } else {
                                angular.forEach(data, function (building_status) {
                                    var temp_building_status = $factory({ classes: ["BuildingStatus", "Model", "Backup", "States"], base_class: "BuildingStatus" });
                                    temp_building_status._model_.fromJSON(building_status);
                                    temp_building_status._backup_.setup();
                                    titles.buildingStatuses.append(temp_building_status);
                                });
                            }
                        }
                        titles.buildingStatuses._states_.loaded(true);
                        $log.log("building statuses = ", titles.buildingStatuses.items);
                    }
                );
            };


            titles.getContractors = function () {
                titles.contractors._states_.loaded(false);
                $http.post("serverside/controllers/titles.php", { action: "getContractors" })
                    .success(function (data) {
                        if (data !== undefined) {
                            if (data["error_code"] !== undefined) {
                                var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                db_error.init(data);
                                db_error.display();
                            } else {
                                angular.forEach(data, function (contractor) {
                                    var temp_contractor = $factory({ classes: ["TitleContractor", "Model", "Backup", "States"], base_class: "TitleContractor" });
                                    temp_contractor._model_.fromJSON(contractor);
                                    temp_contractor._backup_.setup();
                                    titles.contractors.append(temp_contractor);
                                });
                            }
                        }
                        titles.contractors._states_.loaded(true);
                        $log.log("title contractors = ", titles.contractors.items);
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
                                    //temp_title._model_.fromJSON(data);
                                    //temp_title._backup_.setup();
                                    //titles.titles.append(temp_title);
                                    if (callback !== undefined)
                                        callback(data);
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
                    //$application.currentTitleNodes._states_.loaded(false);
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
                            //$application.currentTitleNodes._states_.loaded(true);
                        }
                    );
                }
            };





            titles.getWorkingCommissions = function () {
                titles.workingCommissions._states_.loaded(false);
                $http.post("serverside/controllers/titles.php", { action: "getWorkingCommissions" })
                    .success(function (data) {
                        if (data !== undefined) {
                            if (data["error_code"] !== undefined) {
                                var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                db_error.init(data);
                                db_error.display();
                            } else {
                                angular.forEach(data, function (commission) {
                                    var temp_working_commission = $factory({ classes: ["WorkingCommission", "Model", "Backup", "States"], base_class: "WorkingCommission" });
                                    temp_working_commission._model_.fromJSON(commission);
                                    temp_working_commission._backup_.setup();
                                    titles.workingCommissions.append(temp_working_commission);
                                });
                            }
                        }
                        titles.workingCommissions._states_.loaded(true);
                        $log.log("working commissions = ", titles.workingCommissions.items);
                    }
                );
            };


            titles.addWorkingCommission = function (workingCommission, callback) {
                if (workingCommission !== undefined) {
                    var params = {
                        action: "addWorkingCommission",
                        data: {
                            titleId: workingCommission.titleId.value,
                            date: workingCommission.date.value
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
                                    var temp_working_commission = $factory({ classes: ["WorkingCommission", "Model", "Backup", "States"], base_class: "WorkingCommission" });
                                    temp_working_commission._model_.fromJSON(data);
                                    temp_working_commission._backup_.setup();
                                    titles.workingCommissions.append(temp_working_commission);
                                    if (callback !== undefined)
                                        callback(temp_working_commission);
                                }
                            }
                        }
                    );
                }
            };


            return titles;
        }]);
    })
    .run(function ($modules, $titles, $log, $menu) {
        $modules.load($titles);
        $titles.requests._states_.loaded(false);
        $titles.titles._states_.loaded(false);
        //$titles.getTitles();
        //$titles.getStatuses();
        //$titles.getBuildingPlans();
        //$titles.getBuildingStatuses();
        //$titles.getContractors();
        //$log.log($titules.titules);
        //$titules.titules.display();

        $menu.add({
            id: "titles",
            title: "Титулы",
            description: "Титулы",
            url: "#/titles",
            template: "templates/titles/titles.html",
            controller: "TitlesController",
            icon: "resources/img/icons/title.png",
            order: 2
        });
    });




titles.controller("TitleDetailsController", ["$log", "$scope", "$titles", "$application", "$contractors", "$factory", "$location", "$permissions", function ($log, $scope, $titles, $application, $contractors, $factory, $location, $permissions) {
    $scope.titles = $titles;
    $scope.app = $application;
    $scope.permissions = $permissions;
    $scope.contractors = $contractors;


    $scope.gotoRequest = function (requestId) {
        if (requestId !== undefined) {
            angular.forEach($titles.requests.items, function (request) {
                if (request.id.value === requestId) {
                    if (request._states_.selected() === true) {
                        request._states_.selected(false);
                        $application.currentRequest = undefined;
                    } else {
                        request._states_.selected(true);
                        $application.currentRequest = request;
                    }
                } else {
                    request._states_.selected(false);
                }
            });
            $location.url("requests/");
        }
    };
}]);



titles.controller("EditTitleModalController", ["$log", "$scope", "$location", "$application", "$factory", "$titles", "$nodes", "$misc", "$modals", "$rootScope", function ($log, $scope, $location, $application, $factory, $titles, $nodes, $misc, $modals, $rootScope) {
    $scope.nodes = $nodes;
    $scope.misc = $misc;
    $scope.app = $application;
    $scope.title = $factory({ classes: ["Title", "Model", "Backup", "States"], base_class: "Title" });
    $scope.startNode = undefined;
    $scope.startNodePowerLineId = 0;
    $scope.startNodePylons = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
    $scope.endNode = undefined;
    $scope.endNodePowerLineId = 0;
    $scope.endNodePylons = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
    $scope.needToRefresh = 0;
    $scope.errors = [];


    $scope.$watch("app.currentTitle.startNode.powerLineId.value", function (value) {
        $log.log("start node powerline changed = ", value);
        if (value !== undefined) {
            $scope.startNodePylons._states_.loaded(false);
            $nodes.getPylonsByPowerLineId($application.currentTitle.startNode.powerLineId.value, $scope.onSuccessGetStartNodePylons);
        }
    });

    $scope.$watch("app.currentTitle.endNode.powerLineId.value", function (value) {
        $log.log("end node powerline changed = ", value);
        if (value !== undefined) {
            $scope.endNodePylons._states_.loaded(false);
            $nodes.getPylonsByPowerLineId($application.currentTitle.endNode.powerLineId.value, $scope.onSuccessGetEndNodePylons);
        }
    });

    /**
     * Коллбэк, вызываемый при получении начального и конечного узлов титула
     * @param data - Данные, которые вернул сервер
     */
    $scope.onSuccessGetBoundaryNodes = function (data) {
        $scope.startNode = $nodes.parseNode(data[0]);
        $scope.endNode = $nodes.parseNode(data[1]);
        if ($scope.startNode.nodeTypeId.value === 1) {
            $scope.startNodePowerLineId = $scope.startNode.powerLineId.value;
            $scope.startNodePylons._states_.loaded(false);
            $nodes.getPylonsByPowerLineId($scope.startNodePowerLineId, $scope.onSuccessGetStartNodePylons);
        }
        if ($scope.endNode.nodeTypeId.value === 1) {
            $scope.endNodePowerLineId = $scope.endNode.powerLineId.value;
            $scope.endNodePylons._states_.loaded(false);
            $nodes.getPylonsByPowerLineId($scope.endNodePowerLineId, $scope.onSuccessGetEndNodePylons);
        }
        $log.log("start node = ", $scope.startNode);
        $log.log("end node = ", $scope.endNode);
    };


    //if ($routeParams.titleId !== undefined) {
    //    $scope.title = $titles.titles.find("id", parseInt($routeParams.titleId));
    //    $scope.title._states_.loaded(false);
    //    $log.log("title = ", $scope.title);
        //$titles.getBoundaryNodes($application.currentTitle.id.value, $scope.onSuccessGetBoundaryNodes);
    //scope.test();
   // }


    $scope.selectStartNodePowerLine = function (powerLineId) {
        $log.log("start node powerline changed");
        if (powerLineId !== undefined) {
            $scope.title.startNodeId.value = 0;
            $scope.startNodePylons._states_.loaded(false);
            $nodes.getPylonsByPowerLineId(powerLineId, $scope.onSuccessGetStartNodePylons);
        }
    };


    $scope.onSuccessGetStartNodePylons = function (data) {
        if (data !== undefined) {
            $scope.startNodePylons.clear();
            angular.forEach(data, function (pylon) {
                var temp_pylon = $factory({ classes: ["Pylon", "Model"], base_class: "Pylon" });
                temp_pylon._model_.fromJSON(pylon);
                $scope.startNodePylons.append(temp_pylon);
            });
            $scope.startNodePylons._states_.loaded(true);
        }
    };


    $scope.selectEndNodePowerLine = function (powerLineId) {
        if (powerLineId !== undefined) {
            $scope.title.endNodeId.value = 0;
            $scope.endNodePylons._states_.loaded(false);
            $nodes.getPylonsByPowerLineId(powerLineId, $scope.onSuccessGetEndNodePylons);
        }
    };


    $scope.onSuccessGetEndNodePylons = function (data) {
        if (data !== undefined) {
            $scope.endNodePylons.clear();
            angular.forEach(data, function (pylon) {
                var temp_pylon = $factory({ classes: ["Pylon", "Model"], base_class: "Pylon" });
                temp_pylon._model_.fromJSON(pylon);
                $scope.endNodePylons.append(temp_pylon);
            });
            $scope.endNodePylons._states_.loaded(true);
        }
    };



    /**
     * Отмена изменения в текущем титуле
     */
    $scope.cancelChanges = function () {
        $scope.title._backup_.restore();
        $scope.title._states_.changed(false);
        if ($scope.startNode.nodeTypeId.value === 1)
            $scope.startNodePowerLineId = $scope.startNode.powerLineId.value;
        if ($scope.endNode.nodeTypeId.value === 1)
            $scope.endNodePowerLineId = $scope.endNode.powerLineId.value;
        $scope.errors.splice(0, $scope.errors.length);
        $scope.title._states_.loaded(false);
    };


    /**
     * Коллбэк, вызываемый при изменении титула
     */
    $scope.onChangeTitle = function () {
        $application.currentTitle._states_.changed(true);
        $application.currentTitle._states_.loaded(false);
    };


    /**
     * Валидация данных титула
     */
    $scope.validate = function () {
        $scope.title._states_.loaded(false);
        $scope.errors.splice(0, $scope.errors.length);

        if ($application.currentTitle.title.value === "")
            $scope.errors.push("Вы не указали наименование титула");

        /**
         * Если тип узла в начальной точке титула - опора
         */
        if ($application.currentTitle.startNodeTypeId.value === 1) {
            if ($application.currentTitle.startNode.powerLineId.value === 0)
                $scope.errors.push("Вы не выбрали линию опоры в начале титула");
            if ($application.currentTitle.startNodeId.value === 0)
                $scope.errors.push("Вы не указали номер опоры в начале титула");
        }
        /**
         * Если тип узла в конечной точке титула - опора
         */
        if ($application.currentTitle.endNodeTypeId.value === 1) {
            if ($application.currentTitle.endNode.powerLineId.value === 0)
                $scope.errors.push("Вы не выбрали линию опоры в конце титула");
            if ($application.currentTitle.endNodeId.value === 0)
                $scope.errors.push("Вы не указали номер опоры в конце титула");
        }

        if ($scope.errors.length === 0) {
            $titles.editTitle($application.currentTitle, $scope.onSuccessEditTitle);
        }
    };


    /**
     * Коллбэк, вызываемый при успешном изменении титула
     * @param data {} - Данные, которые вернул сервер
     */
    $scope.onSuccessEditTitle = function (data) {
        $modals.close();
        $log.log("onSuccessEditTilteData = ", data);
        $application.currentTitle._backup_.setup();
        $application.currentTitle._states_.loaded(true);
        $application.currentTitle._states_.changed(false);
    };


    $scope.cancel = function () {
        $modals.close();
        $application.currentTitle._backup_.restore();
        $scope.startNodePowerLineId = 0;
        $scope.endNodePowerLineId = 0;
    };

}]);




/*****
* MODAL CONTROLLERS
******/


