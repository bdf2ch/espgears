"use strict";


var appControllers = angular.module("gears.app.controllers", [])



     /**
     * TitlesController
     * Ктонтроллер раздела титулов
     */
    .controller("TitlesController", ["$log", "$scope", "$location", "$titles", "$application", function ($log, $scope, $location, $titles, $application) {
        $scope.titles = $titles;
        $scope.app = $application;

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
                        }
                    } else
                        title._states_.selected(false);
                });
            }
        };
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
        $scope.startNodePowerLineId = 0;
        $scope.startNodePylons = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
        $scope.endNodePowerLineId = 0;
        $scope.endNodePylons = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
        $scope.errors = [];


        if ($routeParams.titleId !== undefined) {
            $scope.title = $titles.titles.find("id", parseInt($routeParams.titleId));
            $scope.title._states_.loaded(false);
            $log.log("title = ", $scope.title);
        }
    }]);