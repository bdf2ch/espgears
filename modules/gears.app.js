"use strict";



var application = angular.module("gears.app", [
        "ngRoute",                      // Подключаем модуль управления рутами
        "ngCookies",
        "gears",                        // Подключаем модуль с сервисами ядра системы
        "gears.ui",
        "gears.data",
        "gears.files",
        "angularFileUpload",
        "gears.auth",                   // Подключаем модуль с сервисами авторизации
        "gears.app.controllers",        // Подключаем модуль с контроллерами приложения
        "gears.app.modal.controllers",
        "gears.app.filters",             // Подключаем модуль с фильтрами приложения
        "gears.app.titles",
        "gears.app.nodes",
        "gears.app.misc",
        "gears.app.contractors",
        "gears.app.users",

        "gears.shp"
    ])
    .config(function ($provide, $routeProvider) {


        $routeProvider
            .when("/", {
                templateUrl: "templates/dashboard/dashboard.html",
                controller: "DashboardController"
                //redirectTo: "/titles"
            })
            .when("/requests", {
                templateUrl: "templates/requests/requests.html",
                controller: "RequestsController"
            })
            .when("/titles", {
                templateUrl: "templates/titles/titles.html",
                controller: "TitlesController"
            })
            .when("/new-title", {
                templateUrl: "templates/titles/new-title.html",
                controller: "AddTitleController"
            })
            .when("/titles/:titleId", {
                templateUrl: "templates/titles/edit-title.html",
                controller: "EditTitleController"
            })
            .when("/contractors", {
                templateUrl: "templates/contractors/contractors.html",
                controller: "ContractorsController"
            })
            .when("/powerlines", {
                templateUrl: "templates/powerlines/powerlines.html",
                controller: "PowerLinesController"
            })
            .when("/users", {
                templateUrl: "templates/users/users.html",
                controller: "UsersController"
            })
            .when("/new-user", {
                templateUrl: "templates/users/new-user.html",
                controller: "AddUserController"
            })
            .otherwise({ redirectTo: '/titles' });


        /**
         * $application
         * Сервис приложения
         */
        $provide.factory("$application", ["$log", "$http", "$factory", "$titles", "$misc", "$nodes", "$users", "$contractors", "$session", function ($log, $http, $factory, $titles, $misc, $nodes, $users, $contractors, $session) {
            var application = {};

            application.title = "ЭСпРЭСО";
            application.currentRequest = undefined;
            application.currentRequestStatusDocs = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            application.newRequest = $factory({ classes: ["Request", "Model", "Backup", "States"], base_class: "Request" });
            application.newRequestHistory = $factory({ classes: ["RequestHistory", "Model", "Backup", "States"], base_class: "RequestHistory" });
            application.currentRequestHistory = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            application.newRequestHistory = $factory({ classes: ["RequestHistory", "Model", "Backup", "States"], base_class: "RequestHistory" });
            application.newRequestAttachments = $factory({ classes: ["Collection"], base_class: "Collection" });
            //application.editableRequest = undefined;
            application.currentTitle = undefined;
            application.currentTitlePart = undefined;
            application.currentTitleTabId = 0;
            application.currentNode = undefined;
            application.currentContractorType = undefined;
            application.currentContractor = undefined;
            application.currentUserGroup = undefined;
            application.currentUser = undefined;
            application.currentUserPermissions = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            application.currentBuildingPlanItem = undefined;
            application.currentPowerLine = undefined;
            application.currentPowerLineNodes = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            application.currentPowerLineNode = undefined;
            application.currentPowerLineNodeConnectionNodes = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            application.currentPowerLineConnectionNode = undefined;
            application.currentWorkingCommission = undefined;
            application.currentUploaderData = {};

            application.init = function () {
                $http.post("serverside/controllers/init.php")
                    .success(function (data) {
                        if (data["error_code"] !== undefined) {
                            var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                            db_error.init(data);
                            db_error.display();
                        } else {
                            if (data["titles"] !== undefined) {
                                $titles.titles._states_.loaded(false);
                                angular.forEach(data["titles"], function (title) {
                                    var temp_title = $factory({ classes: ["Title", "Model", "Backup", "States"], base_class: "Title" });
                                    temp_title._model_.fromJSON(title);
                                    temp_title._backup_.setup();
                                    $titles.titles.append(temp_title);
                                });
                                $titles.titles._states_.loaded(true);
                            }

                            if (data["titleStatuses"] !== undefined) {
                                $titles.statuses._states_.loaded(false);
                                angular.forEach(data["titleStatuses"], function (status) {
                                    var temp_title_status = $factory({ classes: ["TitleStatus", "Model", "Backup", "States"], base_class: "TitleStatus" });
                                    temp_title_status._model_.fromJSON(status);
                                    temp_title_status._backup_.setup();
                                    $titles.statuses.append(temp_title_status);
                                });
                                $titles.statuses._states_.loaded(false);
                            }

                            if (data["buildingPlans"] !== undefined) {
                                $titles.plans._states_.loaded(false);
                                angular.forEach(data["buildingPlans"], function (plan) {
                                    var temp_plan = $factory({ classes: ["TitleBuildingPlanItem", "Model", "Backup", "States"], base_class: "TitleBuildingPlanItem" });
                                    temp_plan._model_.fromJSON(plan);
                                    temp_plan._backup_.setup();
                                    $titles.plans.append(temp_plan);
                                });
                                $titles.plans._states_.loaded(true);
                            }

                            if (data["buildingStatuses"] !== undefined) {
                                $titles.buildingStatuses._states_.loaded(false);
                                angular.forEach(data["buildingStatuses"], function (status) {
                                    var temp_building_status = $factory({ classes: ["BuildingStatus", "Model", "Backup", "States"], base_class: "BuildingStatus" });
                                    temp_building_status._model_.fromJSON(status);
                                    temp_building_status._backup_.setup();
                                    $titles.buildingStatuses.append(temp_building_status);
                                });
                                $titles.buildingStatuses._states_.loaded(true);
                            }

                            if (data["titleContractors"] !== undefined) {
                                $titles.contractors._states_.loaded(false);
                                angular.forEach(data["titleContractors"], function (title_contractor) {
                                    var temp_title_contractor = $factory({ classes: ["TitleContractor", "Model", "Backup", "States"], base_class: "TitleContractor" });
                                    temp_title_contractor._model_.fromJSON(title_contractor);
                                    temp_title_contractor._backup_.setup();
                                    $titles.contractors.append(temp_title_contractor);
                                });
                                $titles.contractors._states_.loaded(true);
                            }

                            if (data["powerLines"] !== undefined) {
                                $misc.powerLines._states_.loaded(false);
                                angular.forEach(data["powerLines"], function (powerLine) {
                                    var temp_power_line = $factory({ classes: ["PowerLine", "Model", "Backup", "States"], base_class: "PowerLine" });
                                    temp_power_line._model_.fromJSON(powerLine);
                                    temp_power_line._backup_.setup();
                                    $misc.powerLines.append(temp_power_line);
                                });
                                $misc.powerLines._states_.loaded(true);
                            }

                            if (data["nodeTypes"] !== undefined) {
                                $nodes.types._states_.loaded(false);
                                angular.forEach(data["nodeTypes"], function (nodeType) {
                                    var temp_node_type = $factory({ classes: ["NodeType", "Model", "Backup", "States"], base_class: "NodeType" });
                                    temp_node_type._model_.fromJSON(nodeType);
                                    temp_node_type._backup_.setup();
                                    $nodes.types.append(temp_node_type);
                                });
                                $nodes.types._states_.loaded(true);
                            }

                            if (data["userGroups"] !== undefined) {
                                angular.forEach(data["userGroups"], function (userGroup) {
                                    var temp_user_group = $factory({ classes: ["UserGroup", "Model", "Backup", "States"], base_class: "UserGroup" });
                                    temp_user_group._model_.fromJSON(userGroup);
                                    temp_user_group._backup_.setup();
                                    $users.groups.append(temp_user_group);
                                });
                                $users.groups._states_.loaded(true);
                            }

                            if (data["users"] !== undefined) {
                                angular.forEach(data["users"], function (user) {
                                    var temp_user = $factory({ classes: ["User", "Model", "Backup", "States"], base_class: "User" });
                                    temp_user._model_.fromJSON(user);
                                    temp_user._backup_.setup();
                                    $users.users.append(temp_user);
                                });
                                $users.users._states_.loaded(true);
                            }

                            if (data["contractorTypes"] !== undefined) {
                                angular.forEach(data["contractorTypes"], function (contractorType) {
                                    var temp_contractor_type = $factory({ classes: ["ContractorType", "Model", "Backup", "States"], base_class: "ContractorType" });
                                    temp_contractor_type._model_.fromJSON(contractorType);
                                    temp_contractor_type._backup_.setup();
                                    $contractors.contractorTypes.append(temp_contractor_type);
                                });
                                $contractors.contractorTypes._states_.loaded(true);
                            }

                            if (data["contractors"] !== undefined) {
                                angular.forEach(data["contractors"], function (contractor) {
                                    var temp_contractor = $factory({ classes: ["Contractor", "Model", "Backup", "States"], base_class: "Contractor" });
                                    temp_contractor._model_.fromJSON(contractor);
                                    temp_contractor._backup_.setup();
                                    $contractors.contractors.append(temp_contractor);
                                });
                                $contractors.contractors._states_.loaded(true);
                            }

                            if (data["pylonTypes"] !== undefined) {
                                $misc.pylonTypes._states_.loaded(false);
                                angular.forEach(data["pylonTypes"], function (pylon_type) {
                                    var temp_pylon_type = $factory({ classes: ["PylonType", "Model", "Backup", "States"], base_class: "PylonType" });
                                    temp_pylon_type._model_.fromJSON(pylon_type);
                                    temp_pylon_type._backup_.setup();
                                    $misc.pylonTypes.append(temp_pylon_type);
                                });
                                $misc.pylonTypes._states_.loaded(true);
                            }

                            if (data["cableTypes"] !== undefined) {
                                $misc.cableTypes._states_.loaded(false);
                                angular.forEach(data["cableTypes"], function (cable_type) {
                                    var temp_cable_type = $factory({ classes: ["CableType", "Model", "Backup", "States"], base_class: "CableType" });
                                    temp_cable_type._model_.fromJSON(cable_type);
                                    temp_cable_type._backup_.setup();
                                    $misc.cableTypes.append(temp_cable_type);
                                });
                                $misc.cableTypes._states_.loaded(true);
                            }

                            if (data["anchorTypes"] !== undefined) {
                                $misc.anchorTypes._states_.loaded(false);
                                angular.forEach(data["anchorTypes"], function (anchor_type) {
                                    var temp_anchor_type = $factory({ classes: ["AnchorType", "Model", "Backup", "States"], base_class: "AnchorType" });
                                    temp_anchor_type._model_.fromJSON(anchor_type);
                                    temp_anchor_type._backup_.setup();
                                    $misc.anchorTypes.append(temp_anchor_type);
                                });
                                $misc.anchorTypes._states_.loaded(true);
                            }

                            if (data["requestTypes"] !== undefined) {
                                $titles.requestTypes._states_.loaded(false);
                                angular.forEach(data["requestTypes"], function (requestType) {
                                    var temp_request_type = $factory({ classes: ["RequestType", "Model", "Backup", "States"], base_class: "RequestType" });
                                    temp_request_type._model_.fromJSON(requestType);
                                    temp_request_type._backup_.setup();
                                    $titles.requestTypes.append(temp_request_type);
                                });
                                $titles.requestTypes._states_.loaded(true);
                            }

                            if (data["requestStatuses"] !== undefined) {
                                $titles.requestStatuses._states_.loaded(false);
                                angular.forEach(data["requestStatuses"], function (requestStatus) {
                                    var temp_request_status = $factory({ classes: ["RequestStatus", "Model", "Backup", "States"], base_class: "RequestStatus" });
                                    temp_request_status._model_.fromJSON(requestStatus);
                                    temp_request_status._backup_.setup();
                                    $titles.requestStatuses.append(temp_request_status);
                                });
                                $titles.requestStatuses._states_.loaded(true);
                            }

                            if (data["requests"] !== undefined) {
                                angular.forEach(data["requests"], function (request) {
                                    var temp_request = $factory({ classes: ["Request", "Model", "Backup", "States"], base_class: "Request" });
                                    temp_request._model_.fromJSON(request);
                                    temp_request._backup_.setup();
                                    $titles.requests.append(temp_request);
                                });
                            }

                            if (data["workingCommissions"] !== undefined) {
                                $titles.requests._states_.loaded(false);
                                angular.forEach(data["workingCommissions"], function (commission) {
                                    var temp_working_commission = $factory({ classes: ["WorkingCommission", "Model", "Backup", "States"], base_class: "WorkingCommission" });
                                    temp_working_commission._model_.fromJSON(commission);
                                    temp_working_commission._backup_.setup();
                                    $titles.workingCommissions.append(temp_working_commission);
                                });
                                $titles.workingCommissions._states_.loaded(true);
                            }

                            $titles.requests._states_.loaded(true);

                        }
                    }
                );
            };

            return application;
        }]);
    })
    .run(function ($log, $application, $menu, $rootScope, $modules, $factory, $titles, $session, $window) {
        $modules.load($application);
        $rootScope.application = $application;
        $rootScope.menu = $menu;
        moment.locale("ru");

        $application.currentTitleNodes = $factory({ classes: ["TitleNodes", "States"], base_class: "TitleNodes" })
        $titles.requests._states_.loaded(false);
        $application.init();

        $session.onStart();


        $session.appData.set("showSideBar", false);



        $menu.add({
            id: "utilities",
            title: "Дополнительно",
            description: "Дополнительно",
            url: "",
            template: "",
            controller: "",
            icon: "resources/img/icons/utilities.png",
            order: 5
        });

        $menu.add({
            id: "users",
            title: "Пользователи системы",
            description: "Пользователи и группы пользователей системы",
            url: "#/users",
            template: "templates/users/users.html",
            controller: "UsersController",
            icon: "resources/img/icons/user-group.png"
        }, "utilities");

        $menu.add({
            id: "contractors",
            title: "Контрагенты",
            description: "Контрагенты",
            url: "#/contractors",
            template: "templates/contractors/contractors.html",
            controller: "ContractorsController",
            icon: "resources/img/icons/contractor-type.png",
            order: 3
        }, "utilities");

    }
);