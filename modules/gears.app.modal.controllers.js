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
                    temp_request._model_.fromJSON(data);
                    temp_request._backup_.setup();
                    $scope.titles.requests.append(temp_request);
                }
                if (data["title"] !== undefined) {

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
                    temp_title._backup_.setup;
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

    .controller("NewRequestDocumentsController", ["$log", "$scope", "$application", "$titles", "$factory", function ($log, $scope, $application, $titles, $factory) {
        $scope.app = $application;
        $scope.titles = $titles;
        $scope.uploadedDocs = [];

        $scope.onBeforeUploadRID = function () {
            $application.currentUploaderData["doc_type"] = "rid";
            $application.currentUploaderData["newRequestId"] = $application.newRequest.id.value;
            $application.currentUploaderData["userId"] = 76;
        };

        $scope.onCompleteUploadRID = function (data) {
            if (data["request"] !== undefined)
                $application.newRequest._model_.fromJSON(data["request"]);
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

    .controller("EditRequestDocumentsController", ["$log", "$scope", "$application", "$titles", "FileUploader", function ($log, $scope, $application, $titles, FileUploader) {
        $scope.app = $application;
        $scope.titles = $titles;

        var uploader = $scope.uploader = new FileUploader({
            url: "serverside/uploader.php"
            //formData: [
            //    { documentType: "requestInputDocument"}
            //]
        });

        uploader.onCompleteItem = function (item, response, status, headers) {
            console.log("response = ", response[0]);
            //var temp_file = new FileItem();
            //temp_file.fromSOURCE(response[0]);
            //$scope.titules.currentTituleFiles.push(temp_file);
        };

        uploader.onCompleteAll = function () {
            console.info('onCompleteAll');
            uploader.clearQueue();
        };

        uploader.onBeforeUploadItem = function (item) {
            var formData = [{
                tituleId: $scope.titules.currentTituleId,
                userId: $scope.user.id.value
            }];
            Array.prototype.push.apply(item.formData, formData);
        };

        uploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem);
            uploader.uploadAll();
        };
    }])


    .controller("EditRequestStatusModalController", ["$log", "$scope", "$application", "$titles", "$contractors", "$modals", "$factory", function ($log, $scope, $application, $titles, $contractors, $modals, $factory) {
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
            $application.currentUploaderData["userId"] = 76;
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
            }
            $scope.uploadedDocs.splice(0, $scope.uploadedDocs.length);
            $scope.temp_history._model_.reset();
            $scope.temp_file._model_.reset();
            $application.newRequestHistory._model_.reset();
            $application.currentRequest._states_.changed(false);
            $modals.close();
        };


        $scope.onSuccessChangeRequestStatus = function (data) {
            if (data !== undefined) {
                var temp_history = $factory({ classes: ["RequestHistory", "Model", "Backup", "States"], base_class: "RequestHistory" });
                temp_history._model_.fromJSON(data);
                $application.currentRequestHistory.append(temp_history);
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
    }]);