"use strict";


var appControllers = angular.module("gears.app.controllers", [])

    /**
     * DashboardController
     * Контроллер стартовой страницы
     */
    .controller("DashboardController", ["$log", "$scope", "$location", "$application", "$users", function ($log, $scope, $location, $application, $users) {
        $scope.app = $application;
        $scope.users = $users;
    }])

     /**
     * TitlesController
     * Ктонтроллер раздела титулов
     */
    .controller("TitlesController", ["$log", "$scope", "$location", "$titles", "$application", "$files", "$nodes", "$modals", function ($log, $scope, $location, $titles, $application, $files, $nodes, $modals) {
        $scope.titles = $titles;
        $scope.files = $files;
        $scope.app = $application;
        $scope.tabs = [
            {
                id: 1,
                title: "Информация о титуле",
                template: "templates/titles/title-info.html",
                isActive: true
            },
            {
                id: 2,
                title: "Строительство",
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
                title: "Документы",
                template: "templates/titles/title-files.html",
                isActive: false
            }
        ];

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
                                    $scope.app.currentTitleNodes.clear();
                                    $titles.getTitleNodes(titleId, -1, -1, -1, $scope.onSuccessGetTitleNodes);
                                    $scope.app.currentTitleNodes.titleId = titleId;
                                }
                            } else {
                                $scope.app.currentTitleNodes.clear();
                                $titles.getTitleNodes(titleId, -1, -1, -1, $scope.onSuccessGetTitleNodes);
                                $scope.app.currentTitleNodes.titleId = titleId;
                            }
                        }
                    } else
                        title._states_.selected(false);
                });
            }
        };


        $scope.onSuccessGetTitleNodes = function (data) {
            if (data !== undefined) {
                angular.forEach(data, function (node) {
                    var temp_node = $nodes.parseNode(node);
                    $log.log("appended node = ", temp_node);
                    $application.currentTitleNodes.appendNode({ node: temp_node });
                });
            }
        };

        //$modals.show({ width: 400, left: 300, top: 200, position: "center", caption: "Удаление этапа плана работ", template: "templates/modals/delete-building-plan-item.html" });
        //$modals.show();

    }])



    /**
     * AddTitleController
     * Контроллер добавления титула
     */
    .controller("AddTitleController", ["$log", "$scope", "$location", "$factory", "$titles", "$nodes", "$misc", function ($log, $scope, $location, $factory, $titles, $nodes, $misc) {
        $scope.nodes = $nodes;
        $scope.misc = $misc;
        $scope.newTitle = $factory({ classes: ["Title", "Model", "States"], base_class: "Title" });
        $scope.startNodePowerLineId = 0;
        $scope.startNodePylons = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
        $scope.endNodePowerLineId = 0;
        $scope.endNodePylons = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
        $scope.errors = [];


        $scope.newTitle._states_.loaded(false);


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
                $titles.add($scope.newTitle, $scope.onSuccessAddTitle);
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

        $scope.editType = function () {
            $modals.show({
                width: 400,
                position: "center",
                caption: "Редактирование типа контрагента",
                showFog: true,
                closeButton: false,
                template: "templates/modals/edit-contractor-type.html"
            });
        };

        $scope.deleteType = function () {
            $modals.show({
                width: 400,
                position: "center",
                caption: "Удаление типа контрагента",
                showFog: true,
                closeButton: true,
                template: "templates/modals/delete-contractor-type.html"
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

        $scope.editGroup = function () {
            $modals.show({
                width: 400,
                position: "center",
                caption: "Редактирование группы пользователей",
                showFog: true,
                closeButton: false,
                template: "templates/modals/edit-user-group.html"
            });
        };

        $scope.deleteGroup = function () {
            $modals.show({
                width: 400,
                position: "center",
                caption: "Удаление группы пользователей",
                showFog: true,
                closeButton: true,
                template: "templates/modals/delete-user-group.html"
            });
        };

        $scope.onSuccessDeleteUser = function (moment) {
            $log.log("user deleted, moment = ", moment);
            $users.users.delete("id", $application.currentUser.id.value);
            $application.currentUser = undefined;
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
            if (planItem !== undefined) {
                $application.currentBuildingPlanItem = planItem;
                $modals.show({
                    width: 400,
                    position: "center",
                    caption: "Редактирование этапа работ",
                    showFog: true,
                    template: "templates/modals/edit-building-plan-item.html" });
            }
        };
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


    .controller("MontageSchemeController", ["$log", "$scope", "$application", "$titles", "$nodes", function ($log, $scope, $application, $titles, $nodes) {
        $scope.titles = $titles;
        $scope.app = $application;
        $scope.nodes = $nodes;


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

    .controller("DocumentsController", ["$scope", "$files", function ($scope, $files) {
        $scope.files = $files;

        $scope.onSuccessScanFolder = function () {
            $log.log("ONSUCCESSSCANFOLDER");
        };
    }]);