"use strict";


var modalControllers = angular.module("gears.app.modal.controllers", [])


    /**
     * AddPowerLineModalController
     * Контроллер модального окна добавления линии
     */
    .controller("AddPowerLineModalController", ["$log", "$scope", "$misc", "$factory", "$application", "$modals", function ($log, $scope, $misc, $factory, $application, $modals) {
        $scope.newPowerLine = $factory({ classes: ["PowerLine", "Model", "Backup", "States"], base_class: "PowerLine" });
        $scope.errors = [];

        $scope.validate = function () {
            $scope.errors.splice(0, $scope.errors.length);
            if ($scope.newPowerLine.title.value === "")
                $scope.errors.push("Вы не указали наименование линии");
            if ($scope.newPowerLine.voltage.value === "" || $scope.newPowerLine.voltage.value === 0)
                $scope.errors.push("Вы не указали напряжение линии");
            if ($scope.errors.length === 0) {
                $misc.addPowerLine($scope.newPowerLine, $scope.onSuccessAddPowerLine);
            }
        };

        $scope.onSuccessAddPowerLine = function (data) {
            $modals.close();
            $scope.newPowerLine._model_.reset();
        };

        $scope.cancel = function () {
            $modals.close();
            $scope.errors.splice(0, $scope.errors.length);
            $scope.newPowerLine._model_.reset();
            $scope.newPowerLine._states_.changed(false);
        };
    }])


    /**
     * EditPowerLineModalController
     * Контроллер модального окна редактирования линии
     */
    .controller("EditPowerLineModalController", ["$log", "$scope", "$misc", "$application", "$modals", function ($log, $scope, $misc, $application, $modals) {
        $scope.app = $application;
        $scope.misc = $misc;
        $scope.errors = [];

        $scope.cancel = function () {
            $modals.close();
            $scope.errors.splice(0, $scope.errors.length);
            $application.currentPowerLine._backup_.restore();
            $application.currentPowerLine._states_.changed(false);
        };

        $scope.validate = function () {
            $scope.errors.splice(0, $scope.errors.length);
            if ($application.currentPowerLine.title.value === "")
                $scope.errors.push("Вы не указали наименование линии");
            if ($application.currentPowerLine.voltage.value === "")
                $scope.errors.push("Вы не указали напряжение линии");
            if ($scope.errors.length === 0) {
                $application.currentPowerLine._states_.loading(true);
                $misc.editPowerLine($application.currentPowerLine, $scope.onSuccessEditLine);
            }
        };

        $scope.onSuccessEditLine = function (data) {
            $application.currentPowerLine._states_.loaded(true);
            $application.currentPowerLine._states_.loading(false);
            $application.currentPowerLine._backup_.setup();
            $modals.close();
        };
    }])


    /**
     * AddPowerLineNodeModalController
     * Контроллер модального окна добавления опоры в линию
     */
    .controller("AddPowerLineNodeModalController", ["$log", "$scope", "$misc", "$factory", "$application", "$modals", "$nodes", function ($log, $scope, $misc, $factory, $application, $modals, $nodes) {
        $scope.misc = $misc;
        $scope.app = $application;
        $scope.nodes = $nodes;
        $scope.newNode = undefined;
        $scope.newNodeTypeId = 0;
        $scope.errors = [];


        $scope.onChangeNodeType = function (typeId) {
            if (typeId !== undefined) {
                switch (typeId) {
                    case 1:
                        $scope.newNode = $factory({ classes: ["Pylon", "Model", "Backup", "States"], base_class: "Pylon" });
                        break;
                    case 4:
                        $scope.newNode = $factory({ classes: ["PowerStation", "Model", "Backup", "States"], base_class: "PowerStation" });
                        break;
                }
                $log.log("newNode = ", $scope.newNode);
            }
        };

        $scope.validate = function () {
            $scope.errors.splice(0, $scope.errors.length);
            if ($scope.newNodeTypeId === 1) {
                $scope.newNode.powerLineId.value = $application.currentPowerLine.id.value;
                if ($scope.newNode.number.value === "" || $scope.newNode.number.value === 0)
                    $scope.errors.push("Вы не указали номер опоры");
                if ($scope.newNode.powerLineId.value === 0)
                    $scope.errors.push("Вы не указали линию");
            }
            if ($scope.errors.length === 0) {
                $nodes.addNode($scope.newNode, $scope.onSuccessAddNode);
            }
        };


        $scope.onSuccessAddNode = function (data) {
            $modals.close();
            $scope.newNode._model_.reset();
            var temp_node = $nodes.parseNode(data);
            $application.currentPowerLineNodes.append(temp_node);
        };


        $scope.cancel = function () {
            $modals.close();
            $scope.errors.splice(0, $scope.errors.length);
            $scope.newNode._model_.reset();
            $scope.newNode._states_.changed(false);
        };
    }])


    /**
     * EditPowerLineNodeModalController
     * Контроллер модального окна редактирования опоры
     */
    .controller("EditPowerLineNodeModalController", ["$log", "$scope", "$misc", "$application", "$modals", "$nodes", function ($log, $scope, $misc, $application, $modals, $nodes) {
        $scope.app = $application;
        $scope.misc = $misc;
        $scope.errors = [];

        $scope.cancel = function () {
            $modals.close();
            $scope.errors.splice(0, $scope.errors.length);
            $application.currentPowerLineNode._backup_.restore();
            $application.currentPowerLineNode._states_.changed(false);
        };

        $scope.validate = function () {
            $scope.errors.splice(0, $scope.errors.length);
            if ($application.currentPowerLineNode.number.value === "")
                $scope.errors.push("Вы не указали номер опоры");
            if ($application.currentPowerLineNode.powerLineId.value === "")
                $scope.errors.push("Вы не указали линию");
            if ($scope.errors.length === 0) {
                $application.currentPowerLineNode._states_.loading(true);
                $nodes.editNode($application.currentPowerLineNode, $scope.onSuccessEditNode);
            }
        };

        $scope.onSuccessEditNode = function (data) {
            $application.currentPowerLineNode._states_.loaded(true);
            $application.currentPowerLineNode._states_.loading(false);
            $application.currentPowerLineNode._backup_.setup();
            $modals.close();
        };
    }])


/**
 * AddPowerLineModalController
 * Контроллер модального окна добавления линии
 */
    .controller("AddConnectionNodeModalController", ["$log", "$scope", "$misc", "$factory", "$application", "$modals", "$nodes", function ($log, $scope, $misc, $factory, $application, $modals, $nodes) {
        $scope.nodes = $nodes;
        $scope.misc = $misc;
        $scope.newConnectionNode = undefined;
        $scope.newConnectionNodeTypeId = 0;
        $scope.errors = [];

        $scope.onChangeNodeType = function (typeId) {
            if (typeId !== undefined) {
                switch (typeId) {
                    case 2:
                        $scope.newConnectionNode = $factory({ classes: ["Anchor", "Model", "Backup", "States"], base_class: "Anchor" });
                        break;
                    case 3:
                        $scope.newConnectionNode = $factory({ classes: ["Union", "Model", "Backup", "States"], base_class: "Union" });
                        break;
                }
                $log.log("newConnectionNode = ", $scope.newConnectionNode);
            }
        };

        $scope.validate = function () {
            $scope.errors.splice(0, $scope.errors.length);
            if ($scope.newConnectionNodeTypeId === 0) {
                $scope.errors.push("Вы не выбрали тип оборудования");
            }
            if ($scope.newConnectionNodeTypeId === 2) {
                if ($scope.newConnectionNode.anchorTypeId.value === 0)
                    $scope.errors.push("Вы не выбрали тип крепления");
            }
            if ($scope.errors.length === 0) {
                $nodes.addConnectionNode(
                    $scope.newConnectionNode,
                    $scope.newConnectionNodeTypeId,
                    $application.currentPowerLineNode.id.value,
                    $scope.onSuccessAddConnectionNode
                );
            }
        };


        $scope.onSuccessAddConnectionNode = function (data) {
            $modals.close();
            $scope.newConnectionNode = undefined;
            $scope.newConnectionNodeTypeId = 0;
            var temp_connection_node = $nodes.parseNode(data);
            $application.currentPowerLineNodeConnectionNodes.append(temp_connection_node);
        };


        $scope.cancel = function () {
            $modals.close();
            $scope.errors.splice(0, $scope.errors.length);
            $scope.newConnectionNodeTypeId = 0;
            $scope.newConnectionNode = undefined;
        };
    }])


    /**
     * AddRequestModalController
     * Контроллер модального окна добавления заявки
     */
    .controller("AddRequestModalController", ["$log", "$scope", "$misc", "$factory", "$application", "$modals", "$contractors", "$titles", function ($log, $scope, $misc, $factory, $application, $modals, $contractors, $titles) {
        $scope.contractors = $contractors;
        $scope.titles = $titles;
        $scope.newRequest = $factory({ classes: ["Request", "Model", "Backup", "States"], base_class: "Request" });
        $scope.errors = [];
        $scope.tabs = [
            {
                id: 1,
                title: "Подробности",
                template: "templates/requests/new-request-details.html",
                isActive: true
            },
            {
                id: 2,
                title: "Приложения",
                template: "templates/requests/new-request-documents.html",
                isActive: false
            }
        ];

        $scope.validate = function () {
            $scope.errors.splice(0, $scope.errors.length);
            if ($scope.newRequest.description.value === "")
                $scope.errors.push("Вы не указали описание проекта");
            if ($scope.newRequest.start.value === "")
                $scope.errors.push("Вы не указали точку начала проекта");
            if ($scope.newRequest.end.value === "")
                $scope.errors.push("Вы не указали точку конеца проекта");
            if ($scope.errors.length === 0) {
                $titles.addRequest($scope.newRequest, $scope.onSuccessAddRequest);
            }
        };

        $scope.onSuccessAddRequest = function (data) {
            $modals.close();
            $scope.newRequest._model_.reset();
        };

        $scope.cancel = function () {
            $modals.close();
            $scope.errors.splice(0, $scope.errors.length);
            $scope.newRequest._model_.reset();
            $scope.newRequest._states_.changed(false);
        };
    }])


    /**
     * EditRequestModalController
     * Контроллер модального окна редактирования заявки
     */
    .controller("EditRequestModalController", ["$log", "$scope", "$misc", "$application", "$modals", "$nodes", "$contractors", "$location", function ($log, $scope, $misc, $application, $modals, $nodes, $contractors, $location) {
        $scope.app = $application;
        $scope.misc = $misc;
        $scope.contractors = $contractors;
        $scope.errors = [];

        $scope.gotoNewTitle = function () {
            $modals.close();
            $location.url("/new-title");
        };

        $scope.cancel = function () {
            $modals.close();
            $scope.errors.splice(0, $scope.errors.length);
            $application.currentRequest._backup_.restore();
            $application.currentRequest._states_.changed(false);
        };

        $scope.validate = function () {
            $scope.errors.splice(0, $scope.errors.length);
            if ($application.currentPowerLineNode.number.value === "")
                $scope.errors.push("Вы не указали номер опоры");
            if ($application.currentPowerLineNode.powerLineId.value === "")
                $scope.errors.push("Вы не указали линию");
            if ($scope.errors.length === 0) {
                $application.currentPowerLineNode._states_.loading(true);
                $nodes.editNode($application.currentPowerLineNode, $scope.onSuccessEditNode);
            }
        };

        $scope.onSuccessEditNode = function (data) {
            $application.currentRequest._states_.loaded(true);
            $application.currentRequest._states_.loading(false);
            $application.currentRequest._backup_.setup();
            $modals.close();
        };
    }])


    /**
     * AddWorkingCommissionModalController
     * Контроллер модального окна добавления рабочей группы
     */
    .controller("AddWorkingCommissionModalController", ["$log", "$scope", "$misc", "$factory", "$application", "$modals", "$contractors", "$titles", function ($log, $scope, $misc, $factory, $application, $modals, $contractors, $titles) {
        $scope.contractors = $contractors;
        $scope.newWorkingCommission = $factory({ classes: ["WorkingCommission", "Model", "Backup", "States"], base_class: "WorkingCommission" });
        $scope.errors = [];

        $scope.validate = function () {
            $scope.errors.splice(0, $scope.errors.length);
            $scope.newWorkingCommission.titleId.value = $application.currentTitle.id.value;
            if ($scope.newWorkingCommission.date.value === "" || $scope.newWorkingCommission.date.value === 0)
                $scope.errors.push("Вы не указали дату рабочей коммиссии");
            if ($scope.errors.length === 0) {
                $titles.addWorkingCommission($scope.newWorkingCommission, $scope.onSuccessAddWorkingCommission);
            }
        };

        $scope.onSuccessAddWorkingCommission = function (data) {
            $modals.close();
            $scope.newWorkingCommission._model_.reset();
        };

        $scope.cancel = function () {
            $modals.close();
            $scope.errors.splice(0, $scope.errors.length);
            $scope.newWorkingCommission._model_.reset();
            $scope.newWorkingCommission._states_.changed(false);
        };
    }]);