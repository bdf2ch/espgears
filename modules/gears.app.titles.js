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

                /**
                 * RequestType
                 * Набор свойств, описывающих тип заяви
                 */
                RequestType: {
                    id: new Field({ source: "ID", value: 0, default_value: 0 }),
                    title: new Field({ source: "TITLE", value: "", default_value: "" })
                },

                /**
                 * RequestStatus
                 * Набор свойств, описывающих статус заявки
                 */
                RequestStatus: {
                    id: new Field({ source: "ID", value: 0, default_value: 0 }),
                    title: new Field({ source: "TITLE", value: "", default_value: "", backupable: true, required: true })
                },


                FileItem_: {
                    id: new Field({ source: "ID", value: 0, default_value: 0 }),
                    title: new Field({ source: "FILE_TITLE", value: "", default_value: "", backupable: true }),
                    size: new Field({ source: "FILE_SIZE", value: 0, default_value: 0 }),
                    type: new Field({ source: "FILE_TYPE", value: "", default_value: "" })
                },

                /**
                 * Request
                 * Набор свойств, описывающих заявку
                 */
                Request: {
                    id: new Field({ source: "ID", value: 0, default_value: 0 }),
                    requestTypeId: new Field({ source: "REQUEST_TYPE_ID", value: 1, default_value: 1, backupable: true, required: true }),
                    statusId: new Field({ source: "STATUS_ID", value: 0, default_value: 0, backupable: true }),
                    userId: new Field({ source: "USER_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    curatorId: new Field({ source: "CURATOR_ID", value: 0, default_value: 0, backupable: true }),
                    investorId: new Field({ source: "INVESTOR_ID", value: 0, default_value:0, backupable: true, required: true }),
                    titleId: new Field({ source: "TITLE_ID", value: 0, default_value: 0, backupable: true }),
                    title: new Field({ source: "TITLE", value: "", default_value: "", backupable: true, required: true }),
                    description: new Field({ source: "DESCRIPTION", value: "", default_value: "", backupable: true }),
                    buildingPlanDate: new Field({ source: "BUILDING_PLAN_DATE", value: 0, default_value: 0 }),
                    resources: new Field({ source: "RESOURCES", value: "", default_value: "", backupable: true}),
                    added: new Field({ source: "ADDED", value: 0, default_value: 0 }),
                    tu: new Field({ source: "TU_DOC", value: 0, default_value: 0 }),
                    genSogl: new Field({ source: "GEN_SOGL_DOC", value: 0, default_value: 0 }),
                    doud: new Field({ source: "DOUD_DOC", value: 0, default_value: 0 }),

                    _init_: function () {
                        this.tu.value = this.tu.value === 1 ? true : false;
                        this.genSogl.value = this.genSogl.value === 1 ? true : false;
                        this.doud.value = this.doud.value === 1 ? true : false;
                    }
                },

                /**
                 * RequestHistory
                 * набор свойст, описывающих изменение истории статусов заявки
                 */
                RequestHistory: {
                    id: new Field({ source: "ID", value: 0, default_value: 0, backupable: true, required: true }),
                    requestId: new Field({ source: "REQUEST_ID", value:0, default_value: 0, backupable: true }),
                    statusId: new Field({ source: "STATUS_ID", value: 1, default_value: 1, backupable: true }),
                    userId: new Field({ source: "USER_ID", value: 0, default_value: 0, backupable: true }),
                    description: new Field({ source: "DESCRIPTION", value: "", default_value: "", backupable: true }),
                    timestamp: new Field({ source: "TIMESTAMP", value: 0, default_value: 0 })
                    //docs: $factory({ classes: ["Collection", "Model", "Backup", "States"], base_class: "Collection" })
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
             * Получает список всех типов заявки
             */
            titles.getRequestTypes = function () {
                titles.requestTypes._states_.loaded(false);
                $http.post("serverside/controllers/titles.php", { action: "getRequestTypes" })
                    .success(function (data) {
                        if (data !== undefined) {
                            if (data["error_code"] !== undefined) {
                                var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                db_error.init(data);
                                db_error.display();
                            } else {
                                angular.forEach(data, function (requestType) {
                                    var temp_type = $factory({ classes: ["RequestType", "Model", "Backup", "States"], base_class: "RequestType" });
                                    temp_type._model_.fromJSON(requestType);
                                    temp_type._backup_.setup();
                                    titles.requestTypes.append(temp_type);
                                });
                            }
                        }
                        titles.requestTypes._states_.loaded(true);
                        $log.log("request types = ", titles.requestTypes.items);
                    }
                );
            };

            /**
             * Получает список всех статусов заявки
             */
            titles.getRequestStatuses = function () {
                titles.requestStatuses._states_.loaded(false);
                $http.post("serverside/controllers/titles.php", { action: "getRequestStatuses" })
                    .success(function (data) {
                        if (data !== undefined) {
                            if (data["error_code"] !== undefined) {
                                var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                db_error.init(data);
                                db_error.display();
                            } else {
                                angular.forEach(data, function (requestStatus) {
                                    var temp_status = $factory({ classes: ["RequestStatus", "Model", "Backup", "States"], base_class: "RequestStatus" });
                                    temp_status._model_.fromJSON(requestStatus);
                                    temp_status._backup_.setup();
                                    titles.requestStatuses.append(temp_status);
                                });
                            }
                        }
                        titles.requestStatuses._states_.loaded(true);
                        $log.log("request statuses = ", titles.requestStatuses.items);
                    }
                );
            };


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


            titles.addRequest = function (request, callback) {
                if (request !== undefined) {
                    var params = {
                        action: "addRequest",
                        data: {
                            requestTypeId: request.requestTypeId.value,
                            title: request.title.value,
                            description: request.description.value,
                            buildingPlanDate: request.buildingPlanDate.value,
                            resources: request.resources.value,
                            investorId: request.investorId.value,
                            userId: request.userId.value,
                            curatorId: request.curatorId.value
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
                                    var temp_request = $factory({ classes: ["Request", "Model", "Backup", "States"], base_class: "Request" });
                                    temp_request._model_.fromJSON(data);
                                    temp_request._backup_.setup();
                                    titles.requests.append(temp_request);
                                    if (callback !== undefined)
                                        callback(temp_request);
                                }
                            }
                        }
                    );
                }
            };


            titles.changeRequestStatus = function (requestId, statusId, callback) {
                if (requestId !== undefined && statusId !== undefined) {
                    var params = {
                        action: "changeRequestStatus",
                        data: {
                            requestId: requestId,
                            statusId: statusId,
                            userId: 76
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


            titles.downloadTU = function (request) {
                if (request !== undefined) {
                    var params = {
                        data: {
                            requestId: request.id.value
                        }
                    };
                    $http.get("serverside/controllers/downloader.php?requestId=" + request.id.value, params)
                        .success(function (data) {
                            if (data !== undefined) {
                                if (data["error_code"] !== undefined) {
                                    var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                    db_error.init(data);
                                    db_error.display();
                                }
                            }
                        }
                    );
                }
            };


            titles.getRequestHistory = function (request, callback) {
                if (request !== undefined) {
                    var params = {
                        action: "getRequestHistory",
                        data: {
                            requestId: request.id.value
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
    .run(function ($modules, $titles, $log) {
        $modules.load($titles);
        $titles.requests._states_.loaded(false);
        $log.log("requests loaded = ", $titles.requests._states_.loaded());
        //$titles.getTitles();
        //$titles.getStatuses();
        //$titles.getBuildingPlans();
        //$titles.getBuildingStatuses();
        //$titles.getContractors();
        //$log.log($titules.titules);
        //$titules.titules.display();
    });