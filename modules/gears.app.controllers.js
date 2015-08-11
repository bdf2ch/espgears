"use strict";


var appControllers = angular.module("gears.app.controllers", [])


     /**
     * TitlesController
     * Ктонтроллер раздела титулов
     */
    .controller("TitlesController", ["$log", "$scope", "$titles", function ($log, $scope, $titles) {
        $scope.titles = $titles;
    }])


    /**
     * AddTitleController
     * Контроллер добавления титула
     */
    .controller("AddTitleController", ["$log", "$scope", function ($log, $scope) {

    }]);