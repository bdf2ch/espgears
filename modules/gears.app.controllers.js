"use strict";


var appControllers = angular.module("gears.app.controllers", [])

    /**
     * DashboardController
     * Контроллер стартовой страницы
     */
    .controller("DashboardController", ["$log", "$scope", "$location", "$application", "$users", "$modals", "$titles", "$contractors", "$columns", function ($log, $scope, $location, $application, $users, $modals, $titles, $contractors, $columns) {
        $scope.app = $application;
        $scope.users = $users;
        $scope.titles = $titles;
        $scope.contractors = $contractors;
        $scope.log = $log;
        $scope.columns = $columns;


        $scope.tezt = function () {
            $log.info("TEST BUTTON CLICKED");
        };


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

        $scope.initMap = function () {
            ymaps.ready(function () {
                var map = new ymaps.Map(
                    "yandexMap", {
                        center: [65.558456,100.067021],
                        zoom: 3
                    }
                );

                var mounts = [
                    [69.424774,31.125713],
                    [68.033041,32.542949],
                    [67.534101,36.234356],
                    [66.852085,30.477520],
                    [66.292401,33.070293],
                    [66.221548,30.565410],
                    [64.592536,37.948223],
                    [62.718681,36.717754],
                    [63.039659,32.015606],
                    [61.102763,29.466777],
                    [61.102763,37.596660],
                    [63.434296,39.681285],
                    [69.084620,27.068980],
                    [68.187450,24.190563],
                    [67.304651,27.947887],
                    [66.502288,24.520152],
                    [65.482162,28.211559],
                    [62.897975,22.366832],
                    [61.950743,24.498180],
                    [61.826318,27.134898],
                    //[61.376280,28.804820],
                    [60.672676,23.465465],
                    [51.628694,55.660283],
                    [51.395619,58.626592],
                    [53.542115,53.067510],
                    [55.572117,53.660771],
                    [54.703636,56.209600],
                    [56.664500,56.583135],
                    [55.696413,57.791631],
                    [54.957325,61.263310],
                    [53.937929,122.799043],
                    [55.012744,128.072480],
                    [56.572260,126.710175],
                    [58.474951,125.128144],
                    [58.357278,119.992921],
                    [57.657503,117.927491],
                    [56.751267,115.312745],
                    [55.847265,117.158448],
                    //[51.843352,81.152606],
                    //[52.060581,87.304950],
                    //[53.021528,93.043434],
                    //[51.173468,96.153216],
                    //[52.705687,79.603503],
                    //[53.760320,85.008777],
                    //[53.656030,90.985339],
                    //[52.678986,94.764636],
                    //[54.719693,80.020849],
                    //[54.052847,82.877295],
                    //[55.275477,91.534521],
                    //[54.737749,94.700322],
                    //[56.527308,82.439580],
                    //[57.745757,84.636845],
                    //[58.719214,86.350712],
                    //[59.865587,88.108525],
                    //[59.843480,90.613408],
                    //[60.047177,93.220867]
                ];

                var mounts_length = mounts.length;
                for (var i = 0; i < mounts_length; i++) {
                    var mark = new ymaps.Placemark(mounts[i], {
                        hintContent: undefined,
                        balloonContent: undefined
                    },  {
                            cursor: "default",
                            iconLayout: 'default#image',
                            iconImageClipRect: [[0,106], [30, 132]],
                            // Своё изображение иконки метки.
                            iconImageHref: 'resources/img/icons/icons.png',
                            // Размеры метки.
                            iconImageSize: [24, 22],
                            // Смещение левого верхнего угла иконки относительно
                            // её "ножки" (точки привязки).
                            iconImageOffset: [0, -10]
                        }
                    );
                    map.geoObjects.add(mark);
                }

            });



        };


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


