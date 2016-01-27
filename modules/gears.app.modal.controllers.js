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














    .controller("DeleteConnectionNodeModalController", ["$log", "$scope", "$titles", "$application", "$modals", "$nodes", function ($log, $scope, $titles, $application, $modals, $nodes) {
        $scope.app = $application;
        $scope.nodes = $nodes;

        $log.log($scope);

        $scope.delete = function () {
            $nodes.deleteConnectionNode($application.currentPowerLineConnectionNode, $scope.onSuccessDeleteConnectionNode);
        };

        $scope.onSuccessDeleteConnectionNode = function (data) {
            $log.log(JSON.parse(data));
            if (JSON.parse(data) === "success") {
                $modals.close();
                $application.currentPowerLineNodeConnectionNodes.delete("id", $application.currentPowerLineConnectionNode.id.value);
                $application.currentPowerLineConnectionNode = undefined;
            }
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
    }])


    .controller("NewUserModalController", ["$log", "$scope", "$application", "$users", "$factory", "$modals", function ($log, $scope, $application, $users, $factory, $modals) {
        $scope.app = $application;
        $scope.users = $users;
        $scope.newUser = $factory({ classes: ["User", "Model", "Backup", "States"], base_class: "User" });
        $scope.newUserPassword = "";
        $scope.errors = [];


        $scope.validate = function () {
            $scope.errors.splice(0, $scope.errors.length);
            if ($scope.newUser.name.value === "")
                $scope.errors.push("Вы не указали имя пользователя");
            if ($scope.newUser.surname.value === "")
                $scope.errors.push("Вы не указали фамилию пользователя");
            if ($scope.newUser.email.value === "")
                $scope.errors.push("Вы не указали E-mail пользователя");
            if ($scope.newUserPassword === "")
                $scope.errors.push("Вы не указали пароль пользователя");
            if ($scope.errors.length === 0) {
                $users.addUser($scope.newUser, $scope.newUserPassword, $scope.onSuccessAddUser);
            }
        };

        $scope.onSuccessAddUser = function (data) {
            if (data !== undefined) {
                var temp_user = $factory({ classes: ["User", "Model", "Backup", "States"], base_class: "User" });
                temp_user._model_.fromJSON(data);
                temp_user._backup_.setup();
                $users.users.append(temp_user);
                $scope.cancel();
            }
        };

        $scope.cancel = function () {
            $scope.errors.splice(0, $scope.errors.length);
            $scope.newUser._model_.reset();
            $scope.newUserPassword = "";
            $modals.close();
        };
    }])



    .controller("EditUserModalController", ["$log", "$scope", "$users", "$application", "$modals", function ($log, $scope, $users, $application, $modals) {
        $scope.app = $application;
        $scope.users = $users;
        $scope.errors = [];
        $scope.tabs = [
            {
                id: 1,
                title: "Подробности",
                template: "templates/requests/edit-request-details.html",
                isActive: true
            },
            {
                id: 2,
                title: "Приложения",
                template: "templates/requests/edit-request-documents.html",
                isActive: false
            }
        ];


        $scope.cancel = function () {
            $modals.close();
            $scope.errors.splice(0, $scope.errors.length);
            $application.currentUser._backup_.restore();
            $application.currentUser._states_.changed(false);
        };

        $scope.save = function () {
            $scope.errors.splice(0, $scope.errors.length);
            if ($application.currentUser.name.value === "")
                $scope.errors.push("Вы не имя пользователя");
            if ($application.currentUser.surname.value === "")
                $scope.errors.push("Вы не указали фамилию пользователя");
            if ($application.currentUser.email.value === "")
                $scope.errors.push("Вы не указали E-mail пользователя");
            if ($scope.errors.length === 0) {
                $users.editUser($application.currentUser, $scope.onSuccessEditUser);
            }
        };

        $scope.onSuccessEditUser = function (data) {
            $application.currentUser._states_.loaded(true);
            $application.currentUser._states_.loading(false);
            $application.currentUser._states_.changed(false);
            $application.currentUser._backup_.setup();
            $modals.close();
        };
    }])



    .controller("DeleteUserModalController", ["$log", "$scope", "$users", "$application", "$modals", function ($log, $scope, $users, $application, $modals) {
        $scope.app = $application;

        $scope.delete = function () {
            $users.deleteUser($application.currentUser.id.value, $scope.onSuccessDeleteUser);
        };

        $scope.onSuccessDeleteUser = function () {
            $users.users.delete("id", $application.currentUser.id.value);
            $modals.close();
        };
    }])

    .controller("NewTitleModalController", ["$log", "$scope", "$application", "$titles", "$factory", "$modals", "$misc", "$nodes", function ($log, $scope, $application, $titles, $factory, $modals, $misc, $nodes) {
        $scope.app = $application;
        $scope.misc = $misc;
        $scope.nodes = $nodes;
        $scope.newTitle = $factory({ classes: ["Title", "Model", "Backup", "States"], base_class: "Title" });
        $scope.startNodePowerLineId = 0;
        $scope.startNodePylons = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
        $scope.endNodePowerLineId = 0;
        $scope.endNodePylons = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
        $scope.errors = [];


        $scope.onStartNodeTypeChange = function (typeId) {
            if (typeId !== undefined) {
                if (typeId !== 1)
                    $scope.startNodePowerLineId = 0;
            }
        };

        $scope.onEndNodeTypeChange = function (typeId) {
            if (typeId !== undefined) {
                if (typeId !== 1)
                    $scope.endNodePowerLineId = 0;
            }
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
                    $log.log(temp_pylon);
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

        $scope.onSuccessAddTitle = function (data) {
            if (data !== undefined) {
                var temp_title = $factory({ classes: ["Title", "Model", "Backup", "States"], base_class: "Title" });
                temp_title._model_.fromJSON(data);
                temp_title._backup_.setup();
                $titles.titles.append(temp_title);
                $scope.newTitle._states_.loaded(true);
                $scope.startNodePowerLineId = 0;
                $scope.startNodePylons.clear();
                $scope.endNodePowerLineId = 0;
                $scope.endNodePylons.clear();
                $scope.newTitle._model_.reset();
                $modals.close();
            }
        };

        $scope.cancel = function () {
            $scope.errors.splice(0, $scope.errors.length);
            $scope.newTitle._model_.reset();
            $scope.startNodePowerLineId = 0;
            $scope.endNodePowerLineId = 0;
            $modals.close();
        };
    }]);