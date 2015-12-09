"use strict";


var appControllers = angular.module("gears.app.controllers", [])

    /**
     * DashboardController
     * Контроллер стартовой страницы
     */
    .controller("DashboardController", ["$log", "$scope", "$location", "$application", "$users", "$modals", "$titles", "$contractors", function ($log, $scope, $location, $application, $users, $modals, $titles, $contractors) {
        $scope.app = $application;
        $scope.users = $users;
        $scope.titles = $titles;
        $scope.contractors = $contractors;

        $scope.selectRequest = function (requestId) {
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
                    } else
                        request._states_.selected(false);
                });
            }
        };

        $scope.addRequest = function () {
            $modals.show({
                width: 500,
                height: 500,
                position: "center",
                caption: "Новая заявка",
                showFog: true,
                template: "templates/modals/new-request.html"
            });
        };


        $scope.editRequest = function () {
            $modals.show({
                width: 400,
                position: "center",
                caption: "Редактирование заявки",
                showFog: true,
                closeButton: false,
                template: "templates/modals/edit-request.html"
            });
        };


    }])


    /**
     * RequestsController
     * Контроллер раздела журнала заявок
     */
    .controller("RequestsController", ["$log", "$scope", "$titles", "$application", "$modals", "$contractors", "$factory", "$users", "$session", function ($log, $scope, $titles, $application, $modals, $contractors, $factory, $users, $session) {
        $scope.app = $application;
        $scope.session = $session;
        $scope.titles = $titles;
        $scope.contractors = $contractors;
        $scope.users = $users;
        $scope.tabs = [
            {
                id: 1,
                title: "Информация о заявке",
                template: "templates/requests/request-details.html",
                isActive: true
            },
            {
                id: 2,
                title: "Документы",
                template: "templates/requests/request-documents.html",
                isActive: false
            }
        ];


        $scope.selectRequest = function (requestId) {
            if (requestId !== undefined) {
                angular.forEach($titles.requests.items, function (request) {
                    if (request.id.value === requestId) {
                        if ($application.currentRequest !== undefined)
                            $application.currentRequest.inputDocs.clear();
                        if (request._states_.selected() === true) {
                            request._states_.selected(false);
                            $application.currentRequest = undefined;
                            $application.currentRequestHistory.clear();
                            $application.currentRequestStatusDocs.clear();
                        } else {
                            request._states_.selected(true);
                            $application.currentRequest = request;
                            $application.currentUploaderData["requestId"] = requestId;
                            $application.currentRequestHistory.clear();
                            $application.currentRequestHistory._states_.loaded(false);
                            $application.currentRequestStatusDocs.clear();
                            $application.currentRequestStatusDocs._states_.loaded(false);
                            $titles.getRequestHistory($application.currentRequest, $scope.onSuccessGetRequestHistory);
                        }
                    } else {
                        request._states_.selected(false);
                    }
                });
                $log.log("currentRequest = ", $application.currentRequest);
            }
        };


        $scope.onSuccessGetRequestHistory = function (data) {
            if (data !== undefined) {
                var firstHistoryId = 0;
                if (data["history"] !== undefined) {
                    angular.forEach(data["history"], function (history) {
                        var temp_history = $factory({ classes: ["RequestHistory", "Model", "Backup", "States"], base_class: "RequestHistory" });
                        temp_history._model_.fromJSON(history);
                        temp_history._backup_.setup();
                        $application.currentRequestHistory.append(temp_history);
                        if (temp_history.statusId.value === 1) {
                            firstHistoryId = temp_history.id.value;
                            $log.log("first history id = ", firstHistoryId);
                        }
                    });
                    $application.currentRequestHistory._states_.loaded(true);
                }
                if (data["docs"] !== undefined) {
                    angular.forEach(data["docs"], function (history) {
                        var temp_doc = $factory({ classes: ["RequestStatusAttachment", "FileItem_", "Model"], base_class: "RequestStatusAttachment" });
                        temp_doc._model_.fromJSON(history);
                        $application.currentRequestStatusDocs.append(temp_doc);
                        if (temp_doc.statusId.value === firstHistoryId) {
                            $application.currentRequest.inputDocs.append(temp_doc);
                            $log.log("doc id = ", temp_doc.id.value);
                        }
                    });
                    $application.currentRequestStatusDocs._states_.loaded(true);
                }
            }
        };


        $scope.addRequest = function () {
            $modals.show({
                width: 500,
                position: "center",
                caption: "Новая заявка",
                showFog: true,
                closeButton: true,
                template: "templates/modals/new-request_.html",
                onClose: function () {
                    $log.log("MODAL CLOSED");
                },
                scope: function (scope) {
                    $log.log("experimental scope");
                }
            });
        };


        $scope.editRequest = function (requestId, event) {
            event.stopPropagation();
            if (requestId !== undefined) {
                //angular.forEach($titles.requests.items, function (request) {
                //    if (request.id.value === requestId) {
                //        $application.editableRequest = request;
                //    }
                //});
                $modals.show({
                    width: 500,
                    position: "center",
                    caption: "Редактирование заявки",
                    showFog: true,
                    closeButton: false,
                    template: "templates/modals/edit-request.html"
                });
            }
        };


        $scope.changeStatus = function () {
            $modals.show({
                width: 400,
                position: "center",
                caption: "Изменение статуса заявки",
                showFog: true,
                closeButton: false,
                template: "templates/modals/edit-request-status.html"
            });
        };

    }])


    .controller("RequestDetailsController", ["$log", "$scope", "$titles", "$application", "$contractors", "$factory", "$location", function ($log, $scope, $titles, $application, $contractors, $factory, $location) {
        $scope.titles = $titles;
        $scope.app = $application;
        $scope.contractors = $contractors;


        $scope.gotoTitle = function (titleId) {
            if (titleId !== undefined) {
                angular.forEach($titles.titles.items, function (title) {
                    if (title.id.value === titleId) {
                        if (title._states_.selected() === true) {
                            title._states_.selected(false);
                            $application.currentTitle = undefined;
                        } else {
                            title._states_.selected(true);
                            $application.currentTitle = title;
                        }
                    } else {
                        title._states_.selected(false);
                    }
                });
                $location.url("titles/");
            }
        };

        $scope.onBeforeUploadTU = function () {
            $application.currentUploaderData["doc_type"] = "tu";
            $log.log("doc_type = " + $application.currentUploaderData["doc_type"]);
        };

        $scope.onSuccessUploadTU = function (data) {
            $log.log("tu = ", data);
            if (data !== undefined)
                $application.currentRequest.tu.value = true;
        };

        $scope.onBeforeUploadGS = function () {
            $application.currentUploaderData["doc_type"] = "gs";
            $log.log("doc_type = " + $application.currentUploaderData["doc_type"]);
        };

        $scope.onSuccessUploadGS = function (data) {
            if (data !== undefined)
                $application.currentRequest.genSogl.value = true;
        };

        $scope.onBeforeUploadDOUD = function () {
            $application.currentUploaderData["doc_type"] = "doud";
            $log.log("doc_type = " + $application.currentUploaderData["doc_type"]);
        };

        $scope.onSuccessUploadDOUD = function (data) {
            $log.log("tu = ", data);
            if (data !== undefined)
                $application.currentRequest.doud.value = true;
        };
    }])


    .controller("RequestDocumentsController", ["$log", "$scope", "$titles", "$application", "$users", function ($log, $scope, $titles, $application, $users) {
        $scope.titles = $titles;
        $scope.app = $application;
        $scope.users = $users;
    }])


     /**
     * TitlesController
     * Ктонтроллер раздела титулов
     */
    .controller("TitlesController", ["$log", "$scope", "$location", "$titles", "$application", "$files", "$nodes", "$modals", "$misc", function ($log, $scope, $location, $titles, $application, $files, $nodes, $modals, $misc) {
        $scope.titles = $titles;
        $scope.files = $files;
        $scope.app = $application;
        $scope.misc = $misc;
        $scope.tabs = [
            {
                id: 1,
                title: "Информация о титуле",
                template: "templates/titles/title-info.html",
                isActive: true
            },
            {
                id: 2,
                title: "План строительства",
                template: "templates/titles/title-building-plan.html",
                isActive: false
            },
            {
                id: 3,
                title: "Монтажная ведомость",
                template: "templates/titles/title-montage-scheme.html",
                isActive: false
            },
            {
                id: 4,
                title: "Рабочие коммиссии",
                template: "templates/titles/working-commissions.html",
                isActive: false
            },
            {
                id: 5,
                title: "Приемочные коммиссии",
                template: "templates/titles/acceptance-commissions.html",
                isActive: false
            }
        ];

        $scope.onTabSelect = function (tab) {
            if (tab !== undefined) {
                $log.log("selected tab = ", tab);
                $application.currentTitleTabId = tab.id;
            }
        };

        $scope.gotoAddTitle = function () {
            $location.url("/new-title");
        };

        $scope.gotoEditTitle = function (titleId) {
            if (titleId !== undefined)
                $location.url("/titles/" + titleId);
        };

        $scope.selectTitle = function (titleId) {
            if (titleId !== undefined) {
                angular.forEach($scope.titles.titles.items, function (title) {
                    if (title.id.value === titleId) {
                        if (title._states_.selected() === true) {
                            title._states_.selected(false);
                            $scope.app.currentTitle = undefined;
                        } else {
                            title._states_.selected(true);
                            $scope.app.currentTitle = title;
                            if ($scope.app.currentTitleNodes.titleId !== 0) {
                                if ($scope.app.currentTitleNodes.titleId !== titleId) {
                                    $application.currentTitleNodes._states_.loaded(false);
                                    $scope.app.currentTitleNodes.clear();
                                    $titles.getTitleNodes(titleId, -1, -1, -1, $scope.onSuccessGetTitleNodes);
                                    //$titles.getBoundaryNodes(titleId, $scope.onSuccessGetBoundaryNodes);
                                    $scope.app.currentTitleNodes.titleId = titleId;
                                }
                            } else {
                                $scope.app.currentTitleNodes.clear();
                                $titles.getTitleNodes(titleId, -1, -1, -1, $scope.onSuccessGetTitleNodes);
                                $titles.getBoundaryNodes(titleId, $scope.onSuccessGetBoundaryNodes);
                                $scope.app.currentTitleNodes.titleId = titleId;
                            }
                        }
                    } else
                        title._states_.selected(false);
                });
                $log.log("currentTitle = ", $application.currentTitle);
            }
        };


        //$scope.onSuccessGetBoundaryNodes = function (data) {
        //    if (data !== undefined) {
        //        $application.currentTitle.startNode = $nodes.parseNode(data[0]);
        //        $application.currentTitle.endNode = $nodes.parseNode(data[1]);
        //    }
        //};


        $scope.selectNode = function (node) {
            $application.currentNode = node;
        };


        $scope.onSuccessGetTitleNodes = function (data) {
            if (data !== undefined) {
                if (data["nodes"] !== undefined) {
                    angular.forEach(data["nodes"], function (node) {
                        var temp_node = $nodes.parseNode(node);
                        $log.log("appended node = ", temp_node);
                        $application.currentTitleNodes.appendNode({ node: temp_node });
                    });
                    $application.currentTitleNodes._states_.loaded(true);
                }
                if (data["boundaryNodes"] !== undefined) {
                    $application.currentTitle.startNode = $nodes.parseNode(data["boundaryNodes"][0]);
                    $application.currentTitle.endNode = $nodes.parseNode(data["boundaryNodes"][1]);
                }
            }
        };

        $scope.addPlanItem = function () {
            $modals.show({
                width: 400,
                position: "center",
                caption: "Новый этап работ",
                showFog: true,
                template: "templates/modals/new-building-plan-item.html"
            });
        };

        $scope.editPlanItem = function (planItem) {
            $log.log("edit");
            if (planItem !== undefined) {
                $log.log("EDIT PLAN ITEM");
                $modals.show({
                    width: 400,
                    position: "center",
                    caption: "Редактирование этапа работ",
                    showFog: true,
                    template: "templates/modals/edit-building-plan-item.html"
                });
            }
        };

        $scope.addWorkingCommission = function () {
            $modals.show({
                width: 400,
                position: "center",
                caption: "Новая рабочая коммиссия",
                showFog: true,
                template: "templates/modals/new-working-commission.html"
            });
        };

        $scope.addTitle = function () {
            $modals.show({
                width: 570,
                position: "center",
                caption: "Новый титул",
                showFog: true,
                template: "templates/modals/new-title.html"
            });
        };


        $scope.editTitle = function (event) {
            event.stopPropagation();
            $modals.show({
                width: 570,
                position: "center",
                caption: "Редактирование титула",
                showFog: true,
                template: "templates/modals/edit-title.html"
            });
        };

    }])



    /**
     * AddTitleController
     * Контроллер добавления титула
     */
    .controller("AddTitleController", ["$log", "$scope", "$location", "$factory", "$titles", "$nodes", "$misc", "$application", "$users", function ($log, $scope, $location, $factory, $titles, $nodes, $misc, $application, $users) {
        $scope.nodes = $nodes;
        $scope.misc = $misc;
        $scope.app = $application;
        $scope.users = $users;
        $scope.newTitle = $factory({ classes: ["Title", "Model", "States"], base_class: "Title" });
        $scope.startNodePowerLineId = 0;
        $scope.startNodePylons = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
        $scope.endNodePowerLineId = 0;
        $scope.endNodePylons = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
        $scope.errors = [];


        $scope.newTitle._states_.loaded(false);


        $scope.gotoAddTitle = function () {
            preventDefault();
        };

        $scope.gotoTitles = function () {
            $location.url("/titles");
        };


        $scope.selectStartNodePowerLine = function (powerLineId) {
            if (powerLineId !== undefined) {
                $scope.newTitle.startNodeId.value = 0;
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
            $log.log("calleD", powerLineId);
            if (powerLineId !== undefined) {
                $scope.newTitle.endNodeId.value = 0;
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


        $scope.onSuccessAddTitle = function (title) {
            $scope.newTitle._states_.loaded(true);
            $scope.startNodePowerLineId = 0;
            $scope.startNodePylons.clear();
            $scope.endNodePowerLineId = 0;
            $scope.endNodePylons.clear();
            $scope.newTitle._model_.reset();
        };


        $scope.validate = function () {
            $scope.newTitle._states_.loaded(false);
            $scope.errors.splice(0, $scope.errors.length);

            if ($scope.newTitle.title.value === "")
                $scope.errors.push("Вы не указали наименование титула");

            /**
             * Если тип узла в начальной точке титула - опора
             */
            if ($scope.newTitle.startNodeTypeId.value === 1) {
                if ($scope.startNodePowerLineId === 0)
                    $scope.errors.push("Вы не выбрали линию опоры в начале титула");
                if ($scope.newTitle.startNodeId.value === 0)
                    $scope.errors.push("Вы не указали номер опоры в начале титула");
            }
            /**
             * Если тип узла в конечной точке титула - опора
             */
            if ($scope.newTitle.endNodeTypeId.value === 1) {
                if ($scope.endNodePowerLineId === 0)
                    $scope.errors.push("Вы не выбрали линию опоры в конце титула");
                if ($scope.newTitle.endNodeId.value === 0)
                    $scope.errors.push("Вы не указали номер опоры в конце титула");
            }

            if ($scope.errors.length === 0) {
                $titles.addTitle($scope.newTitle, $scope.onSuccessAddTitle);
            }
        };
    }])



    /**
     * EditTitleController
     * Контроллер редактирования титула
     */
    .controller("EditTitleController", ["$log", "$scope", "$location", "$routeParams", "$factory", "$titles", "$nodes", "$misc", function ($log, $scope, $location, $routeParams, $factory, $titles, $nodes, $misc) {
        $scope.nodes = $nodes;
        $scope.misc = $misc;
        $scope.title = $factory({ classes: ["Title", "Model", "Backup", "States"], base_class: "Title" });
        $scope.startNode = undefined;
        $scope.startNodePowerLineId = 0;
        $scope.startNodePylons = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
        $scope.endNode = undefined;
        $scope.endNodePowerLineId = 0;
        $scope.endNodePylons = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
        $scope.errors = [];


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


        if ($routeParams.titleId !== undefined) {
            $scope.title = $titles.titles.find("id", parseInt($routeParams.titleId));
            $scope.title._states_.loaded(false);
            $log.log("title = ", $scope.title);
            $titles.getBoundaryNodes($scope.title.id.value, $scope.onSuccessGetBoundaryNodes);
        }


        $scope.selectStartNodePowerLine = function (powerLineId) {
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
         * Переход в раздел титулов
         */
        $scope.gotoTitles = function () {
            $location.url("/titles");
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
            $scope.title._states_.changed(true);
            $scope.title._states_.loaded(false);
        };


        /**
         * Коллбэк, вызываемый при успешном изменении титула
         * @param data {} - Данные, которые вернул сервер
         */
        $scope.onSuccessEditTitle = function (data) {
            $log.log("onSuccessEditTilteData = ", data);
            $scope.title._backup_.setup();
            $scope.title._states_.loaded(true);
            $scope.title._states_.changed(false);
        };


        /**
         * Валидация данных титула
         */
        $scope.validate = function () {
            $scope.title._states_.loaded(false);
            $scope.errors.splice(0, $scope.errors.length);

            if ($scope.title.title.value === "")
                $scope.errors.push("Вы не указали наименование титула");

            /**
             * Если тип узла в начальной точке титула - опора
             */
            if ($scope.title.startNodeTypeId.value === 1) {
                if ($scope.startNodePowerLineId === 0)
                    $scope.errors.push("Вы не выбрали линию опоры в начале титула");
                if ($scope.title.startNodeId.value === 0)
                    $scope.errors.push("Вы не указали номер опоры в начале титула");
            }
            /**
             * Если тип узла в конечной точке титула - опора
             */
            if ($scope.title.endNodeTypeId.value === 1) {
                if ($scope.endNodePowerLineId === 0)
                    $scope.errors.push("Вы не выбрали линию опоры в конце титула");
                if ($scope.title.endNodeId.value === 0)
                    $scope.errors.push("Вы не указали номер опоры в конце титула");
            }

            if ($scope.errors.length === 0) {
                $titles.edit($scope.title, $scope.onSuccessEditTitle);
            }
        };

    }])


    /**
     * TitleBuildingController
     * Контроллер раздела строительства титула
     */
    .controller("BuildingController", ["$log", "$scope", "$titles", "$application", function ($log, $scope, $titles, $application) {
        $scope.titles = $titles;
        $scope.app = $application;

        $log.log("BUILDING CONTROLLER");
    }])


    /**
     * ContractorsController
     * Контроллер раздела контрагентов
     */
    .controller("ContractorsController", ["$log", "$scope", "$contractors", "$application", "$modals", function ($log, $scope, $contractors, $application, $modals) {
        $scope.contractors = $contractors;
        $scope.app = $application;

        $scope.selectType = function (contractorTypeId) {
            if (contractorTypeId !== undefined) {
                angular.forEach($contractors.contractorTypes.items, function (contractorType) {
                    if (contractorType.id.value === contractorTypeId) {
                        if (contractorType._states_.selected() === true) {
                            contractorType._states_.selected(false);
                            $application.currentContractorType = undefined;
                        } else {
                            contractorType._states_.selected(true);
                            $application.currentContractorType = contractorType;
                        }
                    } else {
                        contractorType._states_.selected(false);
                    }
                });
                $log.log("ct = ", $application.currentContractorType);
            }
        };

        $scope.selectContractor = function (contractorId) {
            if (contractorId !== undefined) {
                angular.forEach($contractors.contractors.items, function (contractor) {
                    if (contractor.id.value === contractorId) {
                        if (contractor._states_.selected() === true) {
                            contractor._states_.selected(false);
                            $application.currentContractor = undefined;
                        } else {
                            contractor._states_.selected(true);
                            $application.currentContractor = contractor;
                        }
                    } else {
                        contractor._states_.selected(false);
                    }
                });
            }
        };

        $scope.addType = function () {
            $modals.show({
                width: 400,
                position: "center",
                caption: "Новый тип контрагента",
                showFog: true,
                template: "templates/modals/new-contractor-type.html"
            });
        };

        $scope.editType = function (event) {
            event.stopPropagation();
            $modals.show({
                width: 400,
                position: "center",
                caption: "Редактирование типа контрагента",
                showFog: true,
                closeButton: false,
                template: "templates/modals/edit-contractor-type.html"
            });
        };


        $scope.deleteType = function (event) {
            event.stopPropagation();
            $modals.show({
                width: 400,
                position: "center",
                caption: "Удаление типа контрагента",
                showFog: true,
                closeButton: true,
                template: "templates/modals/delete-contractor-type.html"
            });
        };

        $scope.addContractor = function () {
            $modals.show({
                width: 400,
                position: "center",
                caption: "Новый контрагент",
                showFog: true,
                template: "templates/modals/new-contractor.html"
            });
        };

        $scope.editContractor = function (event) {
            event.stopPropagation();
            $modals.show({
                width: 400,
                position: "center",
                caption: "Редактирование контрагента",
                showFog: true,
                closeButton: false,
                template: "templates/modals/edit-contractor.html"
            });
        };
    }])



    .controller("AddContractorTypeModalController", ["$scope", "$contractors", "$factory", "$modals", function ($scope, $contractors, $factory, $modals) {
        $scope.contractors = $contractors;
        $scope.newType = $factory({ classes: ["ContractorType", "Model", "Backup", "States"], base_class: "ContractorType" });
        $scope.errors = [];

        $scope.newType._states_.loaded(false);

        $scope.cancel = function () {
            $modals.close();
            $scope.errors.splice(0, $scope.errors.length);
            $scope.newType._model_.reset();
            $scope.newType._states_.changed(false);
        };

        $scope.validate = function () {
            $scope.errors.splice(0, $scope.errors.length);
            if ($scope.newType.title.value === "")
                $scope.errors.push("Вы не указали наименование типа");
            if ($scope.errors.length === 0) {
                $scope.newType._states_.loading(true);
                $contractors.addContractorType($scope.newType, $scope.onSuccessAddType);
            }
        };

        $scope.onSuccessAddType = function (data) {
            $scope.newType._states_.loaded(true);
            $scope.newType._states_.loading(false);
            $scope.newType._model_.reset();
            $modals.close();
        };
    }])


    .controller("EditContractorTypeModalController", ["$scope", "$contractors", "$factory", "$modals", "$application", function ($scope, $contractors, $factory, $modals, $application) {
        $scope.contractors = $contractors;
        $scope.app = $application;
        $scope.errors = [];

        $application.currentContractorType._states_.loaded(false);

        $scope.cancel = function () {
            $modals.close();
            $scope.errors.splice(0, $scope.errors.length);
            $application.currentContractorType._backup_.restore();
            $application.currentContractorType._states_.changed(false);
        };

        $scope.validate = function () {
            $scope.errors.splice(0, $scope.errors.length);
            if ($application.currentContractorType.title.value === "")
                $scope.errors.push("Вы не указали наименование типа");
            if ($scope.errors.length === 0) {
                $application.currentContractorType._states_.loading(true);
                $contractors.editContractorType($application.currentContractorType, $scope.onSuccessEditType);
            }
        };

        $scope.onSuccessEditType = function (data) {
            $application.currentContractorType._states_.loaded(true);
            $application.currentContractorType._states_.loading(false);
            $application.currentContractorType._backup_.setup();
            $modals.close();
        };
    }])


    .controller("DeleteContractorTypeModalController", ["$scope", "$contractors", "$factory", "$modals", "$application", function ($scope, $contractors, $factory, $modals, $application) {
        $scope.contractors = $contractors;
        $scope.app = $application;

        $scope.delete = function () {
            $contractors.deleteContractorType($application.currentContractorType.id.value, $scope.onSuccessDeleteType);
        };

        $scope.onSuccessDeleteType = function () {
            $modals.close();
            $application.currentContractorType = undefined;
        };
    }])


    .controller("AddContractorModalController", ["$log", "$scope", "$contractors", "$factory", "$modals", "$application", function ($log, $scope, $contractors, $factory, $modals, $application) {
        $scope.contractors = $contractors;
        $scope.newContractor = $factory({ classes: ["Contractor", "Model", "Backup", "States"], base_class: "Contractor" });
        $scope.errors = [];

        $scope.newContractor._states_.loaded(false);
        $log.log("cuurent type = ", $application.currentContractorType);
        if ($application.currentContractorType !== undefined) {
            $log.log("current contractor type id = ", $application.currentContractorType.id.value);
            $scope.newContractor.contractorTypeId.value = $application.currentContractorType.id.value;
        }

        $scope.cancel = function () {
            $modals.close();
            $scope.errors.splice(0, $scope.errors.length);
            $scope.newContractor._model_.reset();
            $scope.newContractor._states_.changed(false);
        };

        $scope.validate = function () {
            $scope.errors.splice(0, $scope.errors.length);
            if ($scope.newContractor.title.value === "")
                $scope.errors.push("Вы не указали наименование контрагента");
            if ($scope.errors.length === 0) {
                $scope.newContractor._states_.loading(true);
                $contractors.addContractor($scope.newContractor, $scope.onSuccessAddContractor);
            }
        };

        $scope.onSuccessAddContractor = function (data) {
            $scope.newContractor._states_.loaded(true);
            $scope.newContractor._states_.loading(false);
            $scope.newContractor._model_.reset();
            $modals.close();
        };
    }])


    .controller("EditContractorModalController", ["$scope", "$contractors", "$factory", "$modals", "$application", function ($scope, $contractors, $factory, $modals, $application) {
        $scope.contractors = $contractors;
        $scope.app = $application;
        $scope.errors = [];

        $application.currentContractor._states_.loaded(false);

        $scope.cancel = function () {
            $modals.close();
            $scope.errors.splice(0, $scope.errors.length);
            $application.currentContractor._backup_.restore();
            $application.currentContractor._states_.changed(false);
        };

        $scope.validate = function () {
            $scope.errors.splice(0, $scope.errors.length);
            if ($application.currentContractor.title.value === "")
                $scope.errors.push("Вы не указали наименование контрагента");
            if ($scope.errors.length === 0) {
                $application.currentContractor._states_.loading(true);
                $contractors.editContractor($application.currentContractor, $scope.onSuccessEditContractor);
            }
        };

        $scope.onSuccessEditContractor = function (data) {
            $application.currentContractor._states_.loaded(true);
            $application.currentContractor._states_.loading(false);
            $application.currentContractor._backup_.setup();
            $modals.close();
        };
    }])


    /**
     * UsersController
     * Контроллер раздела пользователей системы
     */
    .controller("UsersController", ["$log", "$scope", "$location", "$users", "$application", "$modals", function ($log, $scope, $location, $users, $application, $modals) {
        $scope.users = $users;
        $scope.app = $application;

        $scope.gotoAddUser = function () {
            $location.url("/new-user");
        };

        $scope.selectGroup = function (groupId) {
            if (groupId !== undefined) {
                angular.forEach($scope.users.groups.items, function (group) {
                    if (group.id.value === groupId) {
                        if (group._states_.selected() === true) {
                            group._states_.selected(false);
                            $application.currentUserGroup = undefined;
                        } else {
                            group._states_.selected(true);
                            $application.currentUserGroup = group;
                            $log.log("group " + $users.groups.find("id", groupId).title.value + " selected");
                        }
                    } else {
                        group._states_.selected(false);
                    }
                });
            }
        };

        $scope.selectUser = function (userId) {
            if (userId !== undefined) {
                angular.forEach($scope.users.users.items, function (user) {
                    if (user.id.value === userId) {
                        if (user._states_.selected() === true) {
                            user._states_.selected(false);
                            $application.currentUser = undefined;
                        } else {
                            user._states_.selected(true);
                            $application.currentUser = user;
                            $users.getPermissions(userId, $scope.onSuccessGetUserPermissions);
                            $log.log("user " + $users.users.find("id", userId).fio + " selected");
                        }
                    } else {
                        user._states_.selected(false);
                    }
                });
            }
        };

        $scope.addGroup = function () {
            $modals.show({
                width: 400,
                position: "center",
                caption: "Новая группа пользователей",
                showFog: true,
                template: "templates/modals/new-user-group.html"
            });
        };

        $scope.editGroup = function (event) {
            event.stopPropagation();
            $modals.show({
                width: 400,
                position: "center",
                caption: "Редактирование группы пользователей",
                showFog: true,
                closeButton: false,
                template: "templates/modals/edit-user-group.html"
            });
        };

        $scope.deleteGroup = function (event) {
            event.stopPropagation();
            $modals.show({
                width: 400,
                position: "center",
                caption: "Удаление группы пользователей",
                showFog: true,
                closeButton: true,
                template: "templates/modals/delete-user-group.html"
            });
        };


        $scope.addUser = function () {
            $modals.show({
                width: 500,
                position: "center",
                caption: "Добавление пользователя",
                showFog: true,
                template: "templates/modals/new-user.html"
            });
        };


        $scope.editUser = function (event) {
            event.stopPropagation();
            $modals.show({
                width: 500,
                position: "center",
                caption: "Редактирование пользователя",
                showFog: true,
                closeButton: true,
                template: "templates/modals/edit-user.html"
            });
        };


        $scope.deleteUser = function (event) {
            event.stopPropagation();
            $modals.show({
                width: 400,
                position: "center",
                caption: "Удаление пользователя",
                showFog: true,
                closeButton: true,
                template: "templates/modals/delete-user.html"
            });
        };

        $scope.onSuccessDeleteUser = function (moment) {
            $log.log("user deleted, moment = ", moment);
            $users.users.delete("id", $application.currentUser.id.value);
            $application.currentUser = undefined;
        };

        $scope.onSuccessGetUserPermissions = function (data) {
            if (data !== undefined) {
                $log.log(data);
            }
        };
    }])


    .controller("AddUserGroupModalController", ["$scope", "$users", "$factory", "$modals", function ($scope, $users, $factory, $modals) {
        $scope.users = $users;
        $scope.newGroup = $factory({ classes: ["UserGroup", "Model", "Backup", "States"], base_class: "UserGroup" });
        $scope.errors = [];

        $scope.newGroup._states_.loaded(false);

        $scope.cancel = function () {
            $modals.close();
            $scope.errors.splice(0, $scope.errors.length);
            $scope.newGroup._model_.reset();
            $scope.newGroup._states_.changed(false);
        };

        $scope.validate = function () {
            $scope.errors.splice(0, $scope.errors.length);
            if ($scope.newGroup.title.value === "")
                $scope.errors.push("Вы не указали наименование группы");
            if ($scope.errors.length === 0) {
                $scope.newGroup._states_.loading(true);
                $users.addGroup($scope.newGroup, $scope.onSuccessAddGroup);
            }
        };

        $scope.onSuccessAddGroup = function (data) {
            $scope.newGroup._states_.loaded(true);
            $scope.newGroup._states_.loading(false);
            $scope.newGroup._model_.reset();
            $modals.close();
        };
    }])


    .controller("EditUserGroupModalController", ["$scope", "$users", "$factory", "$modals", "$application", function ($scope, $users, $factory, $modals, $application) {
        $scope.users = $users;
        $scope.app = $application;
        $scope.errors = [];

        $application.currentUserGroup._states_.loaded(false);

        $scope.cancel = function () {
            $modals.close();
            $scope.errors.splice(0, $scope.errors.length);
            $application.currentUserGroup._backup_.restore();
            $application.currentUserGroup._states_.changed(false);
        };

        $scope.validate = function () {
            $scope.errors.splice(0, $scope.errors.length);
            if ($application.currentUserGroup.title.value === "")
                $scope.errors.push("Вы не указали наименование группы");
            if ($scope.errors.length === 0) {
                $application.currentUserGroup._states_.loading(true);
                $users.editGroup($application.currentUserGroup, $scope.onSuccessEditGroup);
            }
        };

        $scope.onSuccessEditGroup = function (data) {
            $application.currentUserGroup._states_.loaded(true);
            $application.currentUserGroup._states_.loading(false);
            $application.currentUserGroup._backup_.setup();
            $modals.close();
        };
    }])


    .controller("DeleteUserGroupModalController", ["$scope", "$users", "$factory", "$modals", "$application", function ($scope, $users, $factory, $modals, $application) {
        $scope.users = $users;
        $scope.app = $application;

        $scope.delete = function () {
            $users.deleteGroup($application.currentUserGroup.id.value, $scope.onSuccessDeleteGroup);
        };

        $scope.onSuccessDeleteGroup = function () {
            $modals.close();
            $application.currentUserGroup = undefined;
        };
    }])


    .controller("AddUserController", ["$log", "$scope", "$location", "$factory", "$users", "$application", function ($log, $scope, $location, $factory, $users, $application) {
        $scope.users = $users;
        $scope.app = $application
        $scope.newUser = $factory({ classes: ["User", "Model", "Backup", "States"], base_class: "User" });
        $scope.newUser.password = "";
        $scope.errors = [];

        $scope.newUser._states_.loaded(false);

        $scope.gotoUsers = function () {
            $location.url("/users");
        };

        $scope.onSuccessAddUser = function (user) {
            $scope.newUser._states_.loaded(true);
            $scope.newUser._model_.reset();
            $scope.newUser.password = "";
        };

        $scope.validate = function () {
            $scope.newUser._states_.loaded(false);
            $scope.errors.splice(0, $scope.errors.length);

            if ($scope.newUser.name.value === "")
                $scope.errors.push("Вы не указали имя пользователя");
            if ($scope.newUser.fname.value === "")
                $scope.errors.push("Вы не указали отчество пользователя");
            if ($scope.newUser.surname.value === "")
                $scope.errors.push("Вы не указали фамилию пользователя");
            if ($scope.newUser.groupId.value === 0)
                $scope.errors.push("Вы не указали группу пользователя");
            if ($scope.newUser.email.value === "")
                $scope.errors.push("Вы не указали e-mail пользователя");
            if ($scope.newUser.password === "")
                $scope.errors.push("Вы не указали пароль пользователя");

            if ($scope.errors.length === 0) {
                $scope.users.addUser($scope.newUser, $scope.onSuccessAddUser);
            }

        };
    }])


    .controller("BuildingController", ["$log", "$scope", "$application", "$titles", function ($log, $scope, $application, $titles) {
        $scope.titles = $titles;
        $scope.app = $application;
        $scope.tabs = [
            {
                id: 1,
                title: "План работ",
                template: "templates/building/title-building-plan.html",
                isActive: true
            },
            {
                id: 2,
                title: "Рабочие коммиссии",
                template: "templates/building/work-commissions.html",
                isActive: false
            },
            {
                id: 3,
                title: "Приемочная коммиссия",
                template: "templates/building/acceptance-commissions.html",
                isActive: false
            }
        ];


        $scope.selectPlanItem = function (itemId) {
            if (itemId !== undefined) {
                $log.log("SELECT CALLED");
                angular.forEach($scope.titles.plans.items, function (plan) {
                    if (plan.id.value === itemId) {
                        if (plan._states_.selected() === true) {
                            plan._states_.selected(false);
                            $application.currentBuildingPlanItem = undefined;
                        } else {
                            plan._states_.selected(true);
                            $application.currentBuildingPlanItem = plan;
                            //$log.log("plan " + $users.users.find("id", userId).fio + " selected");
                        }
                    } else {
                        plan._states_.selected(false);
                    }
                });
            }
        };

    }])


    .controller("BuildingPlanController", ["$log", "$scope", "$application", "$titles", "$modals", function ($log, $scope, $application, $titles, $modals) {
        $scope.titles = $titles;
        $scope.app = $application;

        $scope.deletePlanItem = function (planItem) {
            if (planItem !== undefined) {
                $application.currentBuildingPlanItem = planItem;
                $modals.show({
                    width: 400,
                    position: "center",
                    caption: "Удаление этапа работ",
                    showFog: true,
                    template: "templates/modals/delete-building-plan-item.html"
                });
            }
        };

        /**
        Перенесено в TitlesController
        $scope.addPlanItem = function () {
            $modals.show({
                width: 400,
                position: "center",
                caption: "Новый этап работ",
                showFog: true,
                template: "templates/modals/new-building-plan-item.html"
            });
        };
        **/
        $scope.selectPlanItem = function (itemId) {
            if (itemId !== undefined) {
                $log.log("SELECT CALLED");
                angular.forEach($scope.titles.plans.items, function (plan) {
                    if (plan.id.value === itemId) {
                        if (plan._states_.selected() === true) {
                            plan._states_.selected(false);
                            $application.currentBuildingPlanItem = undefined;
                        } else {
                            plan._states_.selected(true);
                            $application.currentBuildingPlanItem = plan;
                            //$log.log("plan " + $users.users.find("id", userId).fio + " selected");
                        }
                    } else {
                        plan._states_.selected(false);
                    }
                });
            }
        };

        /*
        $scope.editPlanItem = function (planItem) {
            if (planItem !== undefined) {
                $log.log("EDIT PLAN ITEM");
                $modals.show({
                    width: 400,
                    position: "center",
                    caption: "Редактирование этапа работ",
                    showFog: true,
                    template: "templates/modals/edit-building-plan-item.html" });
            }
        };
        */
    }])


    .controller("AddBuildingPlanModalController", ["$log", "$scope", "$titles", "$factory", "$application", "$modals", function ($log, $scope, $titles, $factory, $application, $modals) {
        $scope.newBuildingPlanItem = $factory({ classes: ["TitleBuildingPlanItem", "Model", "States"], base_class: "TitleBuildingPlanItem" });
        $scope.errors = [];

        $scope.newBuildingPlanItem.titleId.value = $application.currentTitle.id.value;

        $scope.validate = function () {
            $scope.errors.splice(0, $scope.errors.length);
            if ($scope.newBuildingPlanItem.title.value === "")
                $scope.errors.push("Вы не указали наименование этапа работ");
            if ($scope.newBuildingPlanItem.start.value === "")
                $scope.errors.push("Вы не указали дату начала этапа работ");
            if ($scope.newBuildingPlanItem.end.value === "")
                $scope.errors.push("Вы не указали дату окончания этапа работ");
            if ($scope.errors.length === 0) {
                $titles.addBuildingPlan($scope.newBuildingPlanItem, $scope.onSuccessAddBuildingPlan);
            }
        };

        $scope.onSuccessAddBuildingPlan = function (data) {
            $modals.close();
            $scope.newBuildingPlanItem._model_.reset();
            $scope.newBuildingPlanItem.titleId.value = $application.currentTitle.id.value;
        };

        $scope.cancel = function () {
            $modals.close();
            $scope.errors.splice(0, $scope.errors.length);
            $scope.newBuildingPlanItem._model_.reset();
            $scope.newBuildingPlanItem._states_.changed(false);
        };
    }])


    .controller("EditBuildingPlanModalController", ["$log", "$scope", "$titles", "$application", "$modals", function ($log, $scope, $titles, $application, $modals) {
        $scope.app = $application;
        $scope.titles = $titles;
        $scope.errors = [];

        $scope.cancel = function () {
            $modals.close();
            $scope.errors.splice(0, $scope.errors.length);
            $application.currentBuildingPlanItem._backup_.restore();
            $application.currentBuildingPlanItem._states_.changed(false);
        };

        $scope.validate = function () {
            $scope.errors.splice(0, $scope.errors.length);
            if ($application.currentBuildingPlanItem.title.value === "")
                $scope.errors.push("Вы не указали наименование этапа работ");
            if ($application.currentBuildingPlanItem.start.value === "")
                $scope.errors.push("Вы не указали дату начала этапа работ");
            if ($application.currentBuildingPlanItem.end.value === "")
                $scope.errors.push("Вы не указали дату окончания этапа работ");
            if ($scope.errors.length === 0) {
                $application.currentBuildingPlanItem._states_.loading(true);
                $titles.editBuildingPlan($application.currentBuildingPlanItem, $scope.onSuccessEditPlan);
            }
        };

        $scope.onSuccessEditPlan = function (data) {
            $application.currentBuildingPlanItem._states_.loaded(true);
            $application.currentBuildingPlanItem._states_.loading(false);
            $application.currentBuildingPlanItem._backup_.setup();
            $modals.close();
        };
    }])


    .controller("DeleteBuildingPlanModalController", ["$log", "$scope", "$titles", "$application", "$modals", function ($log, $scope, $titles, $application, $modals) {
        $scope.app = $application;

        $scope.delete = function () {
            $titles.deleteBuildingPlan($application.currentBuildingPlanItem.id.value, $scope.onSuccessDeletePlan);
        };

        $scope.onSuccessDeletePlan = function (data) {
            $modals.close();
            $application.currentBuildingPlanItem = undefined;
        };
    }])


    .controller("MontageSchemeController", ["$log", "$scope", "$application", "$titles", "$nodes", "$misc", function ($log, $scope, $application, $titles, $nodes,$misc) {
        $scope.titles = $titles;
        $scope.app = $application;
        $scope.nodes = $nodes;
        $scope.misc = $misc;


        $scope.getBranches = function (nodeId, parentId) {
            if (nodeId !== undefined && parentId !== undefined) {
                if ($application.currentTitleNodes.getBranches({ nodeId: nodeId, parentId: parentId }).length > 0)
                    $application.currentTitleNodes.expand({ nodeId: nodeId, parentId: parentId });
                else
                    $nodes.getBranches(
                        $application.currentTitle.id.value,
                        $application.currentTitlePart !== undefined ? $application.currentTitlePart.id.value : -1,
                        nodeId,
                        $scope.onSuccessGetBranches
                    );
            }
        };

        $scope.onSuccessGetBranches = function (nodeId, data) {
            if (nodeId !== undefined && data !== undefined) {
                angular.forEach(data, function (node) {
                    var temp_node = $nodes.parseNode(node);
                    $log.log("branched node = ", temp_node.id.value);
                    $application.currentTitleNodes.appendNode({ nodeId: nodeId, branchId: temp_node.branchId, node: temp_node })
                });
                //$application.currentTitleNodes.expand({ nodeId: nodeId, parentId:  });
            }
        };
    }])


    .controller("WorkingCommissionsController", ["$log", "$scope", "$application", "$titles", "$nodes", "$misc", function ($log, $scope, $application, $titles, $nodes,$misc) {
        $scope.titles = $titles;
        $scope.app = $application;
        $scope.nodes = $nodes;
        $scope.misc = $misc;



    }])

    .controller("DocumentsController", ["$scope", "$files", function ($scope, $files) {
        $scope.files = $files;

        $scope.onSuccessScanFolder = function () {
            $log.log("ONSUCCESSSCANFOLDER");
        };
    }]);


