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
     * AddRequestModalController
     * Контроллер модального окна добавления заявки
     */
    .controller("AddRequestModalController", ["$log", "$scope", "$misc", "$factory", "$application", "$modals", "$contractors", "$titles", function ($log, $scope, $misc, $factory, $application, $modals, $contractors, $titles) {
        $scope.contractors = $contractors;
        $scope.titles = $titles;
        $scope.app = $application;
        //$scope.newRequest = $factory({ classes: ["Request", "Model", "Backup", "States"], base_class: "Request" });
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
            $log.log($application.newRequest);
            if ($application.newRequest.title.value === "")
                $scope.errors.push("Вы не указали наименование объекта");
            if ($application.newRequest.description.value === "")
                $scope.errors.push("Вы не указали общую информацию об объекте");
            if ($application.newRequest.buildingPlanDate.value === "" || $application.newRequest.buildingPlanDate.value === 0)
                $scope.errors.push("Вы не указали планируемую дату строительства и ввода в эксплуатацию объекта");
            if ($scope.errors.length === 0) {
                if ($application.newRequest.id.value !== 0) {
                    $titles.editRequest($application.newRequest, $scope.onSuccessEditRequest);
                } else {
                    $titles.addRequest($application.newRequest, $scope.onSuccessAddRequest);
                }
            }
        };


        $scope.onSuccessAddRequest = function (data) {
            if (data !== undefined) {
                if (data["request"] !== undefined) {
                    var temp_request = $factory({classes: ["Request", "Model", "Backup", "States"], base_class: "Request"});
                    temp_request._model_.fromJSON(data["request"]);
                    temp_request._backup_.setup();
                    $scope.titles.requests.append(temp_request);
                }
                if (data["title"] !== undefined) {
                    var temp_title = $factory({ classes: ["Title", "Model", "Backup", "States"], base_class: "Title" });
                    temp_title._model_.fromJSON(data["title"]);
                    temp_title._backup_.setup();
                    $titles.titles.append(temp_title);
                }
            }
            $modals.close();
            $application.newRequest._model_.reset();
        };


        $scope.onSuccessEditRequest = function (data) {
            if (data !== undefined) {
                if (data["request"] !== undefined) {
                    var temp_request = $factory({ classes: ["Request", "Model", "Backup", "States"], base_class: "Request" });
                    temp_request._model_.fromJSON(data["request"]);
                    temp_request._backup_.setup();
                    $titles.requests.append(temp_request);
                }
                if (data["title"] !== undefined) {
                    var temp_title = $factory({ classes: ["Title", "Model", "Backup", "States"], base_class: "Title" });
                    temp_title._model_.fromJSON(data["title"]);
                    temp_title._backup_.setup();
                    $titles.titles.append(temp_title);
                }
                $modals.close();
                $application.newRequest._model_.reset();
            }
        };


        $scope.cancel = function () {
            $modals.close();
            if ($application.newRequest.id.value !== 0) {
                $log.log("newRequest = ", $application.newRequest);
                $titles.deleteRequestHistory($application.newRequestHistory, 0, $scope.onSuccessCancelAddNewRequest);
                //$application.currentRequestStatusDocs.delete("id", $scope.temp_file.id.value);
                //$application.currentRequestHistory.delete("id", $scope.temp_history.id.value);
            }
            $scope.errors.splice(0, $scope.errors.length);
            $application.newRequest._model_.reset();
        };

        $scope.onSuccessCancelAddNewRequest = function (data) {
            $application.newRequestHistory._model_.reset();
            $scope.errors.splice(0, $scope.errors.length);
            $application.newRequest._model_.reset();
            $application.newRequest._states_.changed(false);
        };
    }])

    .controller("NewRequestDetailsController", ["$log", "$scope", "$application", "$titles", "$contractors", "$location", function ($log, $scope, $application, $titles, $contractors, $location) {
        $scope.app = $application;
        $scope.titles = $titles;
        $scope.contractors = $contractors;

    }])

    .controller("NewRequestDocumentsController", ["$log", "$scope", "$application", "$titles", "$factory", "$session", function ($log, $scope, $application, $titles, $factory, $session) {
        $scope.app = $application;
        $scope.titles = $titles;
        $scope.uploadedDocs = [];

        $scope.onBeforeUploadRID = function () {
            $application.currentUploaderData["doc_type"] = "rid";
            $application.currentUploaderData["newRequestId"] = $application.newRequest.id.value;
            $application.currentUploaderData["userId"] = $session.user.get().id.value;
        };

        $scope.onCompleteUploadRID = function (data) {
            var temp_request = $factory({ classes: ["Request", "Model", "Backup", "States"], base_class: "Request" });
            temp_request._model_.fromJSON(data["request"]);
            $application.newRequest.id.value = temp_request.id.value;
            if (data["rid"] !== undefined) {
                var temp_file = $factory({ classes: ["RequestAttachment", "FileItem_", "Model", "States"], base_class: "RequestAttachment" });
                temp_file._model_.fromJSON(data["rid"]);
                $scope.uploadedDocs.push(temp_file);
            }
            if (data["history"] !== undefined)
                $application.newRequestHistory._model_.fromJSON(data["history"]);
            if ($application.currentUploaderData["newRequestId"] !== undefined)
                delete $application.currentUploaderData.newRequestId;
            if ($application.currentUploaderData["doc_type"] !== undefined)
                delete $application.currentUploaderData.doc_type;
            if ($application.currentUploaderData["userId"] !== undefined)
                delete $application.currentUploaderData.userId;
        };
    }])


    /**
     * EditRequestModalController
     * Контроллер модального окна редактирования заявки
     */
    .controller("EditRequestModalController", ["$log", "$scope", "$misc", "$application", "$modals", "$nodes", "$contractors", "$location", "$titles", function ($log, $scope, $misc, $application, $modals, $nodes, $contractors, $location, $titles) {
        $scope.app = $application;
        $scope.misc = $misc;
        $scope.contractors = $contractors;
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
            if ($application.currentRequest.title.value === "")
                $scope.errors.push("Вы не указали наименование объекта");
            if ($application.currentRequest.description.value === "")
                $scope.errors.push("Вы не указали общую информацию об объекте");
            if ($application.currentRequest.buildingPlanDate.value === "" || $application.currentRequest.buildingPlanDate.value === 0)
                $scope.errors.push("Вы не указали планируемую дату строительства и ввода в эксплуатацию объекта");
            if ($scope.errors.length === 0) {
                $titles.editRequest($application.currentRequest, $scope.onSuccessEditRequest);
            }
        };

        $scope.onSuccessEditRequest = function (data) {
            $application.currentRequest._states_.loaded(true);
            $application.currentRequest._states_.loading(false);
            $application.currentRequest._states_.changed(false);
            $application.currentRequest._backup_.setup();
            $modals.close();
        };
    }])

    .controller("EditRequestDetailsController", ["$log", "$scope", "$application", "$titles", "$contractors", function ($log, $scope, $application, $titles, $contractors) {
        $scope.app = $application;
        $scope.titles = $titles;
        $scope.contractors = $contractors;
    }])

    .controller("EditRequestDocumentsController", ["$log", "$scope", "$application", "$titles", "$factory", "$session", function ($log, $scope, $application, $titles, $factory, $session) {
        $scope.app = $application;
        $scope.titles = $titles;

        $scope.deleteRsd = function (rsdId) {
            if (rsdId !== undefined) {
                $titles.deleteRequestStatusDoc(rsdId, function () {
                    $application.currentRequest.inputDocs.delete("id", rsdId);
                });
            }
        };

        $scope.onBeforeUploadRID = function () {
            $application.currentUploaderData["doc_type"] = "rid";
            $application.currentUploaderData["userId"] = $session.user.get().id.value;
            $application.currentUploaderData["newRequestId"] = $application.currentRequest.id.value;
        };

        $scope.onCompleteUploadRID = function (data) {
            if (data["rid"] !== undefined) {
                var temp_rid = $factory({ classes: ["RequestStatusAttachment", "FileItem_", "Model", "Backup", "States"], base_class: "RequestStatusAttachment" });
                temp_rid._model_.fromJSON(data["rid"]);
                $application.currentRequest.inputDocs.append(temp_rid);
                $application.currentRequestStatusDocs.append(temp_rid);
            }
            if ($application.currentUploaderData["doc_type"] !== undefined)
                delete $application.currentUploaderData.doc_type;
            if ($application.currentUploaderData["userId"] !== undefined)
                delete $application.currentUploaderData.userId;
        };
    }])


    .controller("EditRequestStatusModalController", ["$log", "$scope", "$application", "$titles", "$contractors", "$modals", "$factory", "$session", function ($log, $scope, $application, $titles, $contractors, $modals, $factory, $session) {
        $scope.app = $application;
        $scope.titles = $titles;
        $scope.contractors = $contractors;
        $scope.uploadedDocs = [];
        $scope.temp_file = $factory({ classes: ["RequestStatusAttachment", "FileItem_", "Model"], base_class: "RequestStatusAttachment" });
        $scope.temp_history = $factory({ classes: ["RequestHistory", "Model", "Backup", "States"], base_class: "RequestHistory" });
        $scope.errors = [];


        $scope.onChangeStatus = function (statusId) {
            if (statusId !== undefined) {
                if (statusId !== $application.currentRequest.statusId.value)
                    $application.currentRequest._states_.changed(true);
                else
                    $application.currentRequest._states_.changed(false);
            }
        };


        $scope.onBeforeUploadRSD = function () {
            $application.currentUploaderData["doc_type"] = "rsd";
            $application.currentUploaderData["statusId"] = $application.currentRequest.statusId.value;
            $application.currentUploaderData["userId"] = $session.user.get().id.value;
            $application.currentUploaderData["description"] = $application.newRequestHistory.description.value;
            $application.currentUploaderData["historyId"] = $scope.temp_history.id.value;
            $application.currentRequest._states_.loaded(false);
        };


        $scope.onCompleteUploadRSD = function (data) {
            /* Если новая история изменения заявки не создана */
            if ($scope.temp_history.id.value === 0) {
                $scope.temp_history._model_.fromJSON(data["status"]);

                var history = $factory({ classes: ["RequestHistory", "Model", "Backup", "States"], base_class: "RequestHistory" });
                history._model_.fromAnother($scope.temp_history);
                $application.currentRequestHistory.append(history);
            }
            $application.currentRequestHistory.find("id", $scope.temp_history.id.value).description.value = data["status"]["DESCRIPTION"];
            $scope.temp_file._model_.fromJSON(data["rsd"]);
            var file = $factory({ classes: ["RequestStatusAttachment", "FileItem_", "Model"], base_class: "RequestStatusAttachment" });
            file._model_.fromJSON(data["rsd"]);
            $scope.uploadedDocs.push(file);
            $application.currentRequestStatusDocs.append(file);


            if ($application.currentUploaderData.historyId !== undefined)
                delete $application.currentUploaderData.historyId;
            if ($application.currentUploaderData.statusId !== undefined)
                delete $application.currentUploaderData.statusId;
            if ($application.currentUploaderData.userId !== undefined)
                delete $application.currentUploaderData.userId;
            if ($application.currentUploaderData.description !== undefined)
                delete $application.currentUploaderData.description;
            if ($application.currentUploaderData.historyId !== undefined)
                delete $application.currentUploaderData.historyId;
            $application.currentRequest._states_.loaded(true);
        };


        $scope.save = function () {
            if ($scope.temp_history.id.value === 0) {
                $titles.changeRequestStatus(
                    $application.currentRequest.id.value,
                    $application.currentRequest.statusId.value,
                    $application.newRequestHistory.description.value,
                    $scope.onSuccessChangeRequestStatus
                );
            } else {
                $titles.editRequestHistory(
                    $scope.temp_history.id.value,
                    $application.newRequestHistory.description.value,
                    $scope.onSuccessEditRequestStatus
                );
            }
            //var history = $factory({ classes: ["RequestHistory", "Model", "Backup", "States"], base_class: "RequestHistory" });
            //history._model_.fromAnother($scope.temp_history);
            //$application.currentRequestHistory.append(history);
            //$application.currentRequestHistory.find("id", $scope.temp_history.id.value).description.value = $scope.temp_history.description.value;

            $scope.uploadedDocs.splice(0, $scope.uploadedDocs.length);
            $scope.temp_history._model_.reset();
            $scope.temp_file._model_.reset();
            $application.newRequestHistory._model_.reset();
            $application.currentRequest._states_.changed(false);
            $modals.close();
        };


        $scope.onSuccessEditRequestStatus = function (data) {
            if (data !== undefined) {
                var temp_history = $factory({ classes: ["RequestHistory", "Model", "Backup", "States"] });
                temp_history._model_.fromJSON(data);
                $application.currentRequestHistory.find("id", temp_history.id.value).description.value = temp_history.description.value;
                $application.currentRequest.statusId.value = temp_history.statusId.value;
                $application.currentRequest._backup_.setup();
            }
        };


        $scope.onSuccessChangeRequestStatus = function (data) {
            if (data !== undefined) {
                var temp_history = $factory({ classes: ["RequestHistory", "Model", "Backup", "States"], base_class: "RequestHistory" });
                temp_history._model_.fromJSON(data);
                $application.currentRequestHistory.append(temp_history);
                $application.currentRequest._backup_.setup();

                $application.currentRequest.statusId.value = temp_history.statusId.value;
                $application.currentRequest._backup_.setup();

                $application.newRequestHistory._model_.reset();
                $modals.close();
            }
        };


        $scope.onSuccessAddRequestHistory = function (data) {
            if (data !== undefined) {
                var temp_history = $factory({ classes: ["RequestHistory", "Model", "Backup", "States"], base_class: "RequestHistory" });
                temp_history._model_.fromJSON(data);
                $application.currentRequestHistory.append(temp_history);
            }
        };


        $scope.cancel = function () {
            $modals.close();
            $scope.errors.splice(0, $scope.errors.length);
            $application.currentRequest._backup_.restore();
            $application.currentRequest._states_.changed(false);
            if ($scope.temp_history.id.value !== 0) {
                $titles.deleteRequestHistory($scope.temp_history, $application.currentRequest._backup_.data.statusId);
                $application.currentRequestStatusDocs.delete("id", $scope.temp_file.id.value);
                $application.currentRequestHistory.delete("id", $scope.temp_history.id.value);
            }
            $scope.uploadedDocs.splice(0, $scope.uploadedDocs.length);
            $application.newRequestHistory._model_.reset();
            $scope.temp_file._model_.reset();
            $scope.temp_history._model_.reset();
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